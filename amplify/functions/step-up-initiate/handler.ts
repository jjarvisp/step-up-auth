import { env } from "$amplify/env/step-up-initiate";

import { AdminGetUserCommand } from "@aws-sdk/client-cognito-identity-provider";
import { PutCommand } from "@aws-sdk/lib-dynamodb";

import type { Schema } from "../../data/resource";

import { cogClient } from "../lib/cog-client";
import { ddbDocClient } from "../lib/ddb-client";

const THREE_MINUTES = 1000 * 60 * 3;

export const handler: Schema["stepUpInitiate"]["functionHandler"] = async (
  event
) => {
  // generate MFA code 😉️
  const mfaCode = "000000";

  // get username from identity
  const username = JSON.parse(JSON.stringify(event.identity)).username;

  // determine user mfa preferences
  const cogUser = await cogClient.send(
    new AdminGetUserCommand({
      Username: username,
      UserPoolId: env.USER_POOL_ID,
    })
  );

  console.log(cogUser);

  // send email / sms
  // 📫️📫️📫️📫️📫️📫️📫️

  // update ddb user session
  await ddbDocClient.send(
    new PutCommand({
      TableName: env.USER_SESSION_TABLE_NAME,
      Item: {
        UserId: username,
        MfaCode: mfaCode,
        ClaimsToAddOrOverride: event.arguments.claimsToAddOrOverride,
        ExpireAt: Math.floor((new Date().getTime() + THREE_MINUTES) / 1000),
      },
    })
  );

  return true;
};
