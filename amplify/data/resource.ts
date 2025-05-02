import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

import { stepUpInitiate } from "../functions/step-up-initiate/resource";
import { stepUpConfirm } from "../functions/step-up-confirm/resource";
import { stepUpValidate } from "../functions/step-up-validate/resource";

const schema = a.schema({
  stepUpInitiate: a
    .mutation()
    .arguments({ claimsToAddOrOverride: a.json().required() })
    .returns(a.boolean())
    .handler(a.handler.function(stepUpInitiate))
    .authorization((allow) => [allow.authenticated()]),
  stepUpConfirm: a
    .mutation()
    .arguments({ mfaCode: a.string().required() })
    .returns(a.boolean())
    .handler(a.handler.function(stepUpConfirm))
    .authorization((allow) => [allow.authenticated()]),
  stepUpValidate: a
    .query()
    .arguments({
      token: a.string().required(),
      requiredClaims: a.json().required(),
    })
    .returns(a.boolean())
    .handler(a.handler.function(stepUpValidate))
    .authorization((allow) => [allow.authenticated()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
  },
});
