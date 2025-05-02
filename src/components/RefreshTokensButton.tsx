import { Button, View } from "@aws-amplify/ui-react";
import { AuthTokens, fetchAuthSession } from "aws-amplify/auth";
import { useState } from "react";

export function RefreshTokensButton() {
  const [tokens, setTokens] = useState<AuthTokens>();
  const handleRefreshTokens = async () => {
    const result = await fetchAuthSession({ forceRefresh: true });

    setTokens(result.tokens);
  };

  return (
    <View>
      <pre>{JSON.stringify(tokens, null, 2)}</pre>
      <Button onClick={handleRefreshTokens}>Refresh Tokens</Button>
    </View>
  );
}
