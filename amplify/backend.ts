import * as iam from "aws-cdk-lib/aws-iam";
import * as ddb from "aws-cdk-lib/aws-dynamodb";

import { defineBackend } from "@aws-amplify/backend";

import { auth } from "./auth/resource";
import { data } from "./data/resource";

import { preTokenGeneration } from "./functions/pre-token-generation/resource";
import { postAuthentication } from "./functions/post-authentication/resource";

import { stepUpInitiate } from "./functions/step-up-initiate/resource";
import { stepUpConfirm } from "./functions/step-up-confirm/resource";
import { stepUpValidate } from "./functions/step-up-validate/resource";

const backend = defineBackend({
  auth,
  data,
  postAuthentication,
  preTokenGeneration,
  stepUpInitiate,
  stepUpConfirm,
  stepUpValidate,
});

const newStack = backend.createStack("new-stack");

const userSessionTable = new ddb.Table(newStack, "user-session-table", {
  partitionKey: {
    name: "UserId",
    type: ddb.AttributeType.STRING,
  },
  timeToLiveAttribute: "ExpireAt",
});

const ddbReadWritePolicy = new iam.PolicyStatement({
  sid: "AllowReadWriteUserSessions",
  actions: [
    "dynamodb:GetItem",
    "dynamodb:PutItem",
    "dynamodb:DeleteItem",
    "dynamodb:UpdateItem",
  ],
  resources: [userSessionTable.tableArn],
});

[
  backend.postAuthentication,
  backend.preTokenGeneration,
  backend.stepUpInitiate,
  backend.stepUpConfirm,
].forEach((amplifyFunction) => {
  amplifyFunction.resources.lambda.addToRolePolicy(ddbReadWritePolicy);
  amplifyFunction.addEnvironment(
    "USER_SESSION_TABLE_NAME",
    userSessionTable.tableName
  );
});

const cognitoAdminGetUserPolicy = new iam.PolicyStatement({
  sid: "AllowAdminGetUser",
  actions: ["cognito-idp:AdminGetUser"],
  resources: [backend.auth.resources.userPool.userPoolArn],
});

backend.stepUpInitiate.resources.lambda.addToRolePolicy(
  cognitoAdminGetUserPolicy
);
backend.stepUpInitiate.addEnvironment(
  "USER_POOL_ID",
  backend.auth.resources.userPool.userPoolId
);

const cognitoDescribeUserPoolClientPolicy = new iam.PolicyStatement({
  sid: "AllowDescribeUserPoolClient",
  actions: ["cognito-idp:DescribeUserPoolClient"],
  resources: [backend.auth.resources.userPool.userPoolArn],
});

backend.stepUpConfirm.resources.lambda.addToRolePolicy(
  cognitoDescribeUserPoolClientPolicy
);
backend.stepUpConfirm.addEnvironment(
  "USER_POOL_ID",
  backend.auth.resources.userPool.userPoolId
);
backend.stepUpConfirm.addEnvironment(
  "USER_POOL_CLIENT_ID",
  backend.auth.resources.userPoolClient.userPoolClientId
);

backend.stepUpValidate.resources.lambda.addToRolePolicy(
  cognitoDescribeUserPoolClientPolicy
);
backend.stepUpValidate.addEnvironment(
  "USER_POOL_ID",
  backend.auth.resources.userPool.userPoolId
);
backend.stepUpValidate.addEnvironment(
  "USER_POOL_CLIENT_ID",
  backend.auth.resources.userPoolClient.userPoolClientId
);
