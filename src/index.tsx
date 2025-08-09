import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router";
import App from "./app";
import { Provider } from "react-redux";
import { persistor, store } from "store/store";
import { PersistGate } from "redux-persist/integration/react";
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://c00dce2ad7dc460007a6fd22b36eb7eb@o4509813454667776.ingest.us.sentry.io/4509813462073344",
  // Setting this option to true will send default PII data to Sentry.
  // For example, automatic IP address collection on events
  sendDefaultPii: true
});

const root = document.getElementById("root") as HTMLElement;

ReactDOM.createRoot(root).render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </PersistGate>
  </Provider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
