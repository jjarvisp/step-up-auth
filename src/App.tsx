import { Flex, Heading, Image, View } from "@aws-amplify/ui-react";
import { StepUpInitiate } from "./components/StepUpInitiate";
import { StepUpConfirm } from "./components/StepUpConfirm";
import { StepUpValidate } from "./components/StepUpValidate";
import { useStepUp } from "./context";
import { SignOutButton } from "./components/SignOutButton";
import { StepUpTokens } from "./components/StepUpTokens";

function StepUpStep() {
  const [stepUpStep] = useStepUp();

  if (stepUpStep === "INITIATED") {
    return <StepUpConfirm />;
  }

  if (stepUpStep === "CONFIRMED") {
    return <StepUpValidate />;
  }

  if (stepUpStep === "VALIDATED") {
    return (
      <Image
        width="auto"
        height="100%"
        alt="spaceship"
        src="https://media.istockphoto.com/id/1452870348/vector/rocket-ship-icon-in-flat-style-spacecraft-takeoff-on-space-background-start-up-illustration.jpg?s=612x612&w=0&k=20&c=Ik4wg3D1NmtuebK88Bgb3CKwY7xx5SQ4RcZWKl38ydw="
      />
    );
  }

  return <StepUpInitiate />;
}

function App() {
  return (
    <Flex
      direction="column"
      justifyContent="space-between"
      alignItems="center"
      padding="4rem"
      minHeight="100vh"
    >
      <Heading level={1} textAlign="center">
        Step Up Authentication Demo
      </Heading>

      <View textAlign="center" height="20vh">
        <StepUpStep />
      </View>

      <StepUpTokens />
      <SignOutButton />
    </Flex>
  );
}

export default App;
