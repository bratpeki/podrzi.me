import { useState } from "react";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../../components/NavigationHeader";
import { apiRequest } from "../../utility/FetchAPI";
import AdminHeader from "./AdminHeader";

function AdminLoginPage() {

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [responseMessage, setResponseMessage] = useState("");

  const handleLogin = async () => {
    try {
      const response = await apiRequest(
        "admins/adminauth",
        "POST",
        null,
        {
          username: username,
          password: password,
        }
      );

      const text = await response;
      if (text === "success") navigate("/admin/home");

      if (text === "invalidDataError") {
        setResponseMessage("Neuspjesna prijava! Provjerite Vase podatke!");
      } else if (text === "usernameError") {
        setResponseMessage("Korisničko ime ne postoji!");
      } else if (text === "passwordError") {
        setResponseMessage("Lozinka je pogrešna!");
      }
    } catch (error) {
      setResponseMessage("Dogodila se greska tokom prijave!");
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-10 gradient-style">
      <AdminHeader></AdminHeader>
      <h1 className="text-4xl font-bold text-cyan-600 mb-8">PODRZI.ME</h1>

      <div className="w-full max-w-md bg-white p-8 shadow-md rounded border">

        <h2 className="text-2xl font-semibold mb-6">
          <center>Prijava <span className="text-red-500">(Admin)</span></center>
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

        <button
          onClick={handleLogin}
          className="w-full button-style mt-2"
        >
          Prijavi se
        </button>

        {responseMessage && (
          <p className="text-center text-sm text-red-600 mb-2 mt-2">
            {responseMessage}
          </p>
        )}

      </div>
    </div>
  );
}

export default AdminLoginPage;
