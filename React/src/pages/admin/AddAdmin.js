import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthStateContext } from "../../components/UseAuthState";
import { apiRequest } from "../../utility/FetchAPI";
import AdminHeader from "./AdminHeader";

function AddAdmin() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const { authState } = useContext(AuthStateContext);

  const handleRegister = async () => {
    try {
      const response = await apiRequest(
        "admins/addadmin",
        "POST",
        authState.adminToken,
        {
          username: username,
          password: password,
        }
      );

      const text = await response;
      if (text == "success") {
        navigate("/admin/home");
      } else if (text == "usernameError") {
        setResponseMessage(
          "Korisnicko ime je vec zauzeto! Molimo Vas unesite drugo korisnicko ime!"
        );
      } else if (text == "displayNameError") {
        setResponseMessage(
          "Prikazno ime je vec zauzeto! Molimo Vas unesite drugo prikazno ime!"
        );
      }
    } catch (error) {
      setResponseMessage("Registracija neuspjesna!");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-10 gradient-style">
      <AdminHeader></AdminHeader>
      <h1 className="text-4xl font-bold text-cyan-600 mb-8">PODRZI.ME</h1>

      <div className="w-full max-w-md bg-white p-8 shadow-md rounded border">
        <h2 className="text-4xl font-extrabold mb-6 text-style">
          <center>Dodaj Admina</center>
        </h2>

        <input
          type="text"
          placeholder="Korisnicko ime"
          className="w-full mb-4 p-2 border border-cyan-600 rounded"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          placeholder="Lozinka"
          className="w-full mb-4 p-2 border border-cyan-600 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button onClick={handleRegister} className="w-full  py-2 button-style">
          Potvrdi
        </button>

        {responseMessage && (
          <p className="text-center text-sm text-red-600 mb-2">
            {responseMessage}
          </p>
        )}
      </div>
    </div>
  );
}

export default AddAdmin;
