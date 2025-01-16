import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router";
import { ApolloProvider } from "@apollo/client";
import App from "./App.jsx";
import { apolloClient } from "./lib/graphql/query.js";
import "bulma/css/bulma.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>
  </StrictMode>
);
