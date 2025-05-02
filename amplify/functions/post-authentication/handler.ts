import { env } from "$amplify/env/pre-token-generation";

import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import type { PostAuthenticationTriggerHandler } from "aws-lambda";

import { ddbDocClient } from "../lib/ddb-client";

export const handler: PostAuthenticationTriggerHandler = async (event) => {
  await ddbDocClient.send(
    new DeleteCommand({
      TableName: env.USER_SESSION_TABLE_NAME,
      Key: {
        UserId: event.userName,
      },
    })
  );

  return event;
};
