import React from "https://esm.sh/react@19.2.4";
import { createRoot } from "https://esm.sh/react-dom@19.2.4/client";

function App() {
  return React.createElement(
    "h1",
    { style: { textAlign: "center", marginTop: "40px" } },
    "Friends Association App is Live ✅"
  );
}

createRoot(document.getElementById("root")).render(
  React.createElement(App)
);
