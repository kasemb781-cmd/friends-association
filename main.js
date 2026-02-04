import React from "https://esm.sh/react@19.2.4";
import { createRoot } from "https://esm.sh/react-dom@19.2.4/client";

function App() {
  const [page, setPage] = React.useState("home");

  if (page === "login") {
    return React.createElement(
      "div",
      { style: { textAlign: "center", marginTop: "40px" } },
      React.createElement("h2", null, "Login Page"),
      React.createElement(
        "button",
        { onClick: () => setPage("home") },
        "Back"
      )
    );
  }

  if (page === "signup") {
    return React.createElement(
      "div",
      { style: { textAlign: "center", marginTop: "40px" } },
      React.createElement("h2", null, "Signup Page"),
      React.createElement(
        "button",
        { onClick: () => setPage("home") },
        "Back"
      )
    );
  }

  // Home page
  return React.createElement(
    "div",
    { style: { textAlign: "center", marginTop: "40px" } },
    React.createElement("h1", null, "Friends Association App is Live ✅"),
    React.createElement(
      "button",
      { onClick: () => setPage("login"), style: { marginRight: "10px" } },
      "Login"
    ),
    React.createElement(
      "button",
      { onClick: () => setPage("signup") },
      "Signup"
    )
  );
}

createRoot(document.getElementById("root")).render(
  React.createElement(App)
);
