import * as React from "react";
import { Button, View } from "@aws-amplify/ui-react";

import { client } from "../client";
import { useStepUp } from "../context";

export function StepUpInitiate() {
  const [, setStepUpStep] = useStepUp();
  const [loading, setLoading] = React.useState(false);
  const handleStepUpInitiate = async () => {
    try {
      setLoading(true);
      const { data } = await client.mutations.stepUpInitiate({
        claimsToAddOrOverride: JSON.stringify({ spaghetti: "noodle" }),
      });
      console.log(data);
      if (data) {
        setStepUpStep("INITIATED");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <View>
      <Button
        variation="destructive"
        onClick={handleStepUpInitiate}
        isLoading={loading}
        loadingText="Preparing..."
        size="large"
      >
        Launch Rocket
      </Button>
    </View>
  );
}
