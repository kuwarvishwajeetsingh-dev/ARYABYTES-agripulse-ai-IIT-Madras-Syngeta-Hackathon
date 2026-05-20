import { useState } from "react";

function Login({ onLogin }) {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {

    if (
      username === "admin" &&
      password === "admin123"
    ) {

      localStorage.setItem("loggedIn", "true");

      onLogin();

    } else {

      alert("Invalid Credentials");

    }
  };

  return (

    <div className="min-h-screen bg-[#0B1120] flex items-center justify-center">

      <div className="bg-[#1E293B] p-10 rounded-2xl w-[400px]">

        <h1 className="text-4xl font-bold text-green-400 mb-8 text-center">
          🌾 Agri AI Login
        </h1>

        <input
          type="text"
          placeholder="Username"
          className="w-full p-3 rounded-lg mb-4 bg-[#0F172A] text-white"
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-lg mb-6 bg-[#0F172A] text-white"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleLogin}
          className="w-full bg-green-500 hover:bg-green-600 p-3 rounded-lg font-bold"
        >
          Login
        </button>

      </div>

    </div>
  );
}

export default Login;