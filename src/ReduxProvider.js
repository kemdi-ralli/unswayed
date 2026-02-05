"use client";

import { useEffect, useState } from "react";
import { Provider } from "react-redux";
import store, { persistor } from "./redux/store";

const REHYDRATE_MAX_MS = 2500;

function MinimalShell() {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        width: "100%",
      }}
    >
      <div
        style={{
          width: 40,
          height: 40,
          border: "3px solid #e0e0e0",
          borderTopColor: "#189e33",
          borderRadius: "50%",
          animation: "redux-persist-spin 0.8s linear infinite",
        }}
      />
      <style>{`@keyframes redux-persist-spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function RehydrateGate({ children }) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let timeoutId;
    const check = () => {
      if (persistor.getState().bootstrapped) setReady(true);
    };
    const unsub = persistor.subscribe(check);
    check(); // in case already bootstrapped (e.g. empty persist)
    timeoutId = setTimeout(setReady.bind(null, true), REHYDRATE_MAX_MS);

    return () => {
      unsub();
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  if (!ready) return <MinimalShell />;
  return children;
}

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <RehydrateGate>{children}</RehydrateGate>
    </Provider>
  );
}
