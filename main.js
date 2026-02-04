import React, { useState } from "https://esm.sh/react@19.2.4";
import { createRoot } from "https://esm.sh/react-dom@19.2.4/client";

function App() {
  const [page, setPage] = useState("home");

  return React.createElement(
    "div",
    { style: { fontFamily: "Arial", textAlign: "center", marginTop: "40px" } },

    // Title
    React.createElement("h1", null, "Friends Association App ✅"),

    // Navigation Buttons
    React.createElement(
      "div",
      { style: { marginBottom: "20px" } },
      React.createElement(
        "button",
        { onClick: () => setPage("login"), style: btnStyle },
        "Login"
      ),
      React.createElement(
        "button",
        { onClick: () => setPage("signup"), style: btnStyle },
        "Signup"
      )
    ),

    // Pages
    page === "login" && LoginForm(),
    page === "signup" && SignupForm()
  );
}

function LoginForm() {
  return React.createElement(
    "div",
    formStyle,
    React.createElement("h2", null, "Login"),
    React.createElement("input", { placeholder: "Email", style: inputStyle }),
    React.createElement("input", {
      placeholder: "Password",
      type: "password",
      style: inputStyle,
    }),
    React.createElement("button", { style: btnStyle }, "Login")
  );
}

function SignupForm() {
  return React.createElement(
    "div",
    formStyle,
    React.createElement("h2", null, "Signup"),
    React.createElement("input", { placeholder: "Full Name", style: inputStyle }),
    React.createElement("input", { placeholder: "Email", style: inputStyle }),
    React.createElement("input", {
      placeholder: "Password",
      type: "password",
      style: inputStyle,
    }),
    React.createElement("button", { style: btnStyle }, "Create Account")
  );
}

// Styles
const btnStyle = {
  margin: "5px",
  padding: "10px 20px",
  cursor: "pointer",
};

const inputStyle = {
  display: "block",
  margin: "10px auto",
  padding: "10px",
  width: "80%",
};

const formStyle = {
  border: "1px solid #ccc",
  padding: "20px",
  maxWidth: "300px",
  margin: "auto",
};

createRoot(document.getElementById("root")).render(
  React.createElement(App)
);
