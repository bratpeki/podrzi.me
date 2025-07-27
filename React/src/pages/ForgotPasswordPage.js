import React, { useState } from "react";
import NavigationBar from "../components/NavigationHeader"; 
import { Link } from "react-router-dom";
import Swal from "sweetalert2"; 
import withReactContent from "sweetalert2-react-content"; 

const MySwal = withReactContent(Swal); 

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    MySwal.fire({
      title: "Slanje zahtjeva...",
      text: "Molimo sačekajte.",
      didOpen: () => {
        MySwal.showLoading();
      },
      allowOutsideClick: false,
      allowEscapeKey: false,
      allowEnterKey: false,
    });

    try {
      const apiUrl = `http://podrzime.ddns.net:8080/api/users/forgotpassword?email=${encodeURIComponent(email)}`;
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      MySwal.close(); 

      if (response.ok) {
        MySwal.fire({
          icon: "success",
          title: "Uspješno!",
          text: "Email za resetovanje lozinke je poslan na Vašu adresu! Provjerite inbox.",
        });
        setEmail(""); 
      } else {
        const errorText = await response.text();
        MySwal.fire({
          icon: "error",
          title: "Greška!",
          text: `Greška prilikom slanja zahtjeva: ${errorText || response.statusText}`,
        });
      }
    } catch (error) {
      MySwal.close(); 
      console.error("Došlo je do greške prilikom slanja zahtjeva:", error);
      MySwal.fire({
        icon: "error",
        title: "Greška!",
        text: "Došlo je do greške prilikom slanja zahtjeva. Pokušajte ponovo.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-10 gradient-style">
      <NavigationBar
        showSearch={false}
        showCreate={false}
        showProfile={false}
        showNotification={false}
        showLogout={false}
      />
      <h1 className="text-4xl font-bold text-cyan-600 mb-8">PODRZI.ME</h1>

      <div className="w-full max-w-md bg-white p-8 shadow-md rounded border rounded-lg">
        <h2 className="text-2xl font-semibold mb-6 text-center">
          Pronađite svoj nalog
        </h2>
        <p className="text-center mb-6 text-gray-700">
          Unesite vašu email adresu da bismo Vam poslali šifru.
        </p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Vaša email adresa"
            className="w-full mb-4 p-3 border border-cyan-600 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 placeholder-gray-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <button
            type="submit"
            className="w-full bg-cyan-600 text-white font-semibold py-3 px-4 rounded-md hover:bg-cyan-700 transition duration-300 shadow-md"
          >
            Pošalji šifru
          </button>
        </form>


        <div className="text-center mt-6 text-sm">
          <Link to="/login" className="text-cyan-600 hover:underline">
            Nazad na prijavu
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPasswordPage;
