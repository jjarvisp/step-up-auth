import * as React from "react";
import { Button, Flex, Input, Label, View } from "@aws-amplify/ui-react";

import { client } from "../client";
import { useStepUp } from "../context";

export function StepUpConfirm() {
  const [loading, setLoading] = React.useState(false);
  const [, setStepUpStep] = useStepUp();
  const [mfaCode, setMfaCode] = React.useState("000000");

  const handleStepUpConfirm = async () => {
    try {
      setLoading(true);
      const { data } = await client.mutations.stepUpConfirm({
        mfaCode: "000000",
      });
      console.log(data);
      if (data) {
        setStepUpStep("CONFIRMED");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View>
      <Flex direction="column" gap="small" marginBottom="1rem">
        <Label htmlFor="code">Code:</Label>
        <Input
          id="code"
          name="code"
          type="text"
          value={mfaCode}
          onChange={(e) => setMfaCode(e.target.value)}
          size="large"
        />
      </Flex>
      <Button
        variation="primary"
        onClick={handleStepUpConfirm}
        isLoading={loading}
        loadingText="Confirming..."
        size="large"
      >
        Confirm MFA Code
      </Button>
    </View>
  );
}
