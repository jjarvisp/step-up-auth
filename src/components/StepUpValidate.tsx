import * as React from "react";
import { Button, View } from "@aws-amplify/ui-react";

import { client } from "../client";
import { fetchAuthSession } from "aws-amplify/auth";
import { useStepUp } from "../context";

export function StepUpValidate() {
  const [, setStepUpStep] = useStepUp();
  const [loading, setLoading] = React.useState(false);

  const handleStepUpValidate = async () => {
    try {
      setLoading(true);
      const { tokens } = await fetchAuthSession({ forceRefresh: true });

      const idTokenJwt = tokens?.idToken?.toString();

      if (idTokenJwt) {
        const { data } = await client.queries.stepUpValidate({
          token: idTokenJwt,
          requiredClaims: JSON.stringify({ spaghetti: "noodle" }),
        });

        console.log(data);

        if (data) {
          setStepUpStep("VALIDATED");
        }
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <View>
      <Button
        variation="primary"
        onClick={handleStepUpValidate}
        isLoading={loading}
        loadingText="Validating..."
        size="large"
      >
        Validate Step Up
      </Button>
    </View>
  );
}
