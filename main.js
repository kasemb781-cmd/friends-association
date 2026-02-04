if (page === "signup") {
  return React.createElement(
    "div",
    { style: { maxWidth: "400px", margin: "40px auto" } },

    React.createElement("h2", { style: { textAlign: "center" } }, "Member Signup"),

    React.createElement("input", {
      placeholder: "Full Name",
      style: inputStyle
    }),

    React.createElement("select", { style: inputStyle }, 
      React.createElement("option", null, "Select ID Type"),
      React.createElement("option", null, "NID"),
      React.createElement("option", null, "Passport"),
      React.createElement("option", null, "Birth Certificate")
    ),

    React.createElement("input", {
      placeholder: "Identification Number",
      style: inputStyle
    }),

    React.createElement("input", {
      placeholder: "Mobile Number",
      style: inputStyle
    }),

    React.createElement("input", {
      placeholder: "Email Address",
      style: inputStyle
    }),

    React.createElement("select", { style: inputStyle },
      React.createElement("option", null, "Select Occupation"),
      React.createElement("option", null, "Expatriates"),
      React.createElement("option", null, "Businessman"),
      React.createElement("option", null, "Student"),
      React.createElement("option", null, "Job Holder")
    ),

    React.createElement("input", {
      type: "password",
      placeholder: "Password",
      style: inputStyle
    }),

    React.createElement("input", {
      type: "password",
      placeholder: "Confirm Password",
      style: inputStyle
    }),

    React.createElement(
      "button",
      { style: buttonStyle },
      "Create Account"
    ),

    React.createElement(
      "button",
      {
        style: { marginTop: "10px", width: "100%" },
        onClick: () => setPage("home")
      },
      "Back"
    )
  );
}
