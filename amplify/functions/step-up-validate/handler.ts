import { env } from "$amplify/env/step-up-validate";

import * as jose from "jose";

import { Schema } from "../../data/resource";

const COGNITO_USER_POOL_URL = `https://cognito-idp.${env.AWS_REGION}.amazonaws.com/${env.USER_POOL_ID}`;

export const handler: Schema["stepUpValidate"]["functionHandler"] = async (
  event
) => {
  // verify jwt format, jws signature, and jwt claims set
  const jwksUrl = `${COGNITO_USER_POOL_URL}/.well-known/jwks.json`;
  const jwks = jose.createRemoteJWKSet(new URL(jwksUrl));
  const { payload } = await jose.jwtVerify(event.arguments.token, jwks, {
    issuer: COGNITO_USER_POOL_URL,
    audience: env.USER_POOL_CLIENT_ID,
  });

  // verify required claims exist
  const isValid = Object.entries(event.arguments.requiredClaims).every(
    ([key, value]) => payload[key] === value
  );

  return isValid;
};
