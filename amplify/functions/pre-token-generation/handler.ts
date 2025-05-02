import { env } from "$amplify/env/pre-token-generation";

import { GetCommand } from "@aws-sdk/lib-dynamodb";
import type { PreTokenGenerationTriggerHandler } from "aws-lambda";

import { ddbDocClient } from "../lib/ddb-client";

export const handler: PreTokenGenerationTriggerHandler = async (event) => {
  const userSession = await ddbDocClient.send(
    new GetCommand({
      TableName: env.USER_SESSION_TABLE_NAME,
      Key: {
        UserId: event.userName,
      },
    })
  );

  if (
    userSession.Item?.Status &&
    userSession.Item?.ExpireAt > new Date().getTime() / 1000
  ) {
    event.response.claimsOverrideDetails = {
      claimsToAddOrOverride: userSession.Item.ClaimsToAddOrOverride,
    };
  }

  return event;
};
