import { AuthTokens, fetchAuthSession } from "aws-amplify/auth";
import * as React from "react";

type StepUpContextType = "INITIATED" | "CONFIRMED" | "VALIDATED" | null;

const StepUpContext = React.createContext<
  [StepUpContextType, React.Dispatch<StepUpContextType>, AuthTokens | undefined]
>([null, () => {}, undefined]);

interface StepUpProviderProps {
  children: React.ReactNode;
}
export function StepUpProvider({ children }: StepUpProviderProps) {
  const [state, setState] = React.useState<StepUpContextType>(null);

  const [tokens, setTokens] = React.useState<AuthTokens>();

  React.useEffect(() => {
    (async () => {
      const { tokens: newTokens } = await fetchAuthSession({
        forceRefresh: true,
      });
      setTokens(newTokens);
    })();
  }, [state]);

  return (
    <StepUpContext.Provider value={[state, setState, tokens]}>
      {children}
    </StepUpContext.Provider>
  );
}

export const useStepUp = () => {
  const context = React.useContext(StepUpContext);
  if (!context) {
    throw new Error("useStepUp must be used within StepUpProvider");
  }
  return context;
};
