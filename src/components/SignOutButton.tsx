import { Button } from "@aws-amplify/ui-react";
import { signOut } from "aws-amplify/auth";

export function SignOutButton() {
  const handleSignOut = () => {
    signOut();
  };
  return (
    <Button variation="link" onClick={handleSignOut}>
      Sign Out
    </Button>
  );
}
