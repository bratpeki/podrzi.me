// src/LoginPage.js
import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthStateContext } from "./components/UseAuthState";

function LoginPage() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const { authState, authDispatch } = useContext(AuthStateContext);

  const handleLogin = async () => {
    try {
      const url = `http://podrzime.ddns.net:8080/api/users/userauth`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: username,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Autentifikacija neuspjesna!");
      }

      const text = await response.text();
      if (text == "loginerror") {
        setResponseMessage("Neuspjesna prijava! Provjerite Vase podatke!");
      } else {
        authDispatch({
          type: "login",
          payload: {
            accessToken: text,
          },
        });
        navigate("/home");
      }
    } catch (error) {
      setResponseMessage("Dogodila se greska tokom prijave!");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-10">
      <h1 className="text-4xl font-bold text-cyan-600 mb-8">PODRZI.ME</h1>

      <div className="w-full max-w-md bg-white p-8 shadow-md rounded border">
        <h2 className="text-2xl font-semibold mb-6">
          <center>Prijava</center>
        </h2>

        <input
          type="username"
          placeholder="Korisnicko ime"
          className="w-full mb-4 p-2 border border-cyan-600 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <input
          type="password"
          placeholder="Lozinka"
          className="w-full mb-2 p-2 border border-cyan-600 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <div className="text-right text-sm mb-4">
          <a href="#" className="link-style">
            Zaboravili ste lozinku?
          </a>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-cyan-600 text-white py-2 rounded hover:bg-cyan-700 mb-4"
        >
          Prijavi se
        </button>

        <button
          onClick={() => navigate("/home")}
          className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 mb-4"
        >
          Prijavi se kao gost
        </button>
        {responseMessage && (
          <p className="text-center text-sm text-red-600 mb-2">
            {responseMessage}
          </p>
        )}

        <div className="flex items-center space-x-1 text-sm">
          <span>Nemate nalog?</span>
          <Link to="/register" className="link-style">
            Registruj se
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
