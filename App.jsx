import { BrowserRouter, Routes, Route } from "react-router-dom";

function Home()
  return <h1>Friends Association App is Live ✅</h1>;
}

function Login() {
  return <h1>Login Page</h1>;
}

function Signup() {
  return <h1>Signup Page</h1>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </BrowserRouter>
  );
}
