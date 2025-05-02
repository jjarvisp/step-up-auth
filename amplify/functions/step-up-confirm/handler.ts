import { env } from "$amplify/env/step-up-confirm";

import { GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import {
  DescribeUserPoolClientCommand,
  type TimeUnitsType,
} from "@aws-sdk/client-cognito-identity-provider";

import type { Schema } from "../../data/resource";

import { ddbDocClient } from "../lib/ddb-client";
import { cogClient } from "../lib/cog-client";

const timeUnitsMap: Record<TimeUnitsType, number> = {
  days: 1000 * 60 * 60 * 24,
  hours: 1000 * 60 * 60,
  minutes: 1000 * 60,
  seconds: 1000,
};

export const handler: Schema["stepUpConfirm"]["functionHandler"] = async (
  event
) => {
  // hacky get username from identity
  const username = JSON.parse(JSON.stringify(event.identity)).username;

  const existingUserSession = await ddbDocClient.send(
    new GetCommand({
      TableName: env.USER_SESSION_TABLE_NAME,
      Key: {
        UserId: username,
      },
    })
  );

  // validate MFA code
  if (
    existingUserSession.Item?.ExpireAt > new Date().getTime() / 1000 &&
    event.arguments.mfaCode === existingUserSession.Item?.MfaCode
  ) {
    // determine refresh token validity period
    const { UserPoolClient } = await cogClient.send(
      new DescribeUserPoolClientCommand({
        UserPoolId: env.USER_POOL_ID,
        ClientId: env.USER_POOL_CLIENT_ID,
      })
    );

    // default is 60 minutes
    const idTokenValidity = UserPoolClient?.IdTokenValidity || 60;
    const idTokenValidityUnits =
      UserPoolClient?.TokenValidityUnits?.IdToken || "minutes";

    const idTokenValidityInMilliseconds =
      idTokenValidity * timeUnitsMap[idTokenValidityUnits];

    // update ddb user session
    await ddbDocClient.send(
      new UpdateCommand({
        TableName: env.USER_SESSION_TABLE_NAME,
        Key: {
          UserId: username,
        },
        UpdateExpression: "SET #Status = :Status, #ExpireAt = :ExpireAt",
        ExpressionAttributeNames: {
          "#Status": "Status",
          "#ExpireAt": "ExpireAt",
        },
        ExpressionAttributeValues: {
          ":Status": true,
          ":ExpireAt": Math.floor(
            (new Date().getTime() + idTokenValidityInMilliseconds) / 1000
          ),
        },
      })
    );

    return true;
  }

  return false;
};
