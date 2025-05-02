import { defineAuth } from "@aws-amplify/backend";
import { postAuthentication } from "../functions/post-authentication/resource";
import { preTokenGeneration } from "../functions/pre-token-generation/resource";

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  triggers: {
    postAuthentication,
    preTokenGeneration,
  },
});
