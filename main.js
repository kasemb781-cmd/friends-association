import React from "https://esm.sh/react@19.2.4";
import { createRoot } from "https://esm.sh/react-dom@19.2.4/client";

function App() {
  return React.createElement(
    "div",
    { style: { textAlign: "center", marginTop: "40px", fontFamily: "Arial" } },
    [
      React.createElement("h1", {}, "Friends Association"),
      React.createElement("h2", {}, "Login / Signup Coming Soon"),
      React.createElement(
        "button",
        {
          style: {
            padding: "10px 20px",
            marginTop: "20px",
            fontSize: "16px",
            cursor: "pointer",
          },
          onClick: () => alert("Login System Next Step 🚀"),
        },
        "Login"
      )
    ]
  );
}

createRoot(document.getElementById("root")).render(
  React.createElement(App)
);
