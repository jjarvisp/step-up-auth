import { useStepUp } from "../context";

export function StepUpTokens() {
  const [, , tokens] = useStepUp();

  return <pre>{JSON.stringify(tokens?.idToken?.payload, null, 2)}</pre>;
}
