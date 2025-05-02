import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";

import "./index.css";
import App from "./App.tsx";

import amplifyOutputs from "../amplify_outputs.json";
import { StepUpProvider } from "./context.tsx";
import { Authenticator } from "@aws-amplify/ui-react";

Amplify.configure(amplifyOutputs);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Authenticator.Provider>
      <Authenticator>
        <StepUpProvider>
          <App />
        </StepUpProvider>
      </Authenticator>
    </Authenticator.Provider>
  </StrictMode>
);
