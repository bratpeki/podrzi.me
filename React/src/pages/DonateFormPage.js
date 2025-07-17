import React, { useState, useContext, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import NavigationBar from "../components/NavigationHeader.js";
import InfoFooter from "../components/InfoFooter.js";
import { AuthStateContext } from "../components/UseAuthState.js";
import { apiRequest } from "../utility/FetchAPI.js"; 
import { jwtDecode } from "jwt-decode"; // Za ID korisnika, mada u testu ne šaljemo ID jer ga panča vadi iz tokena xD

function DonateFormPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { authState } = useContext(AuthStateContext);

  // Action getter
  const { action } = location.state || {};

  const [amount, setAmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Provjera da li je akcija dostupna
  useEffect(() => {
    if (!action) {
      navigate("/"); // Preusmeri na početnu ako nema akcije
    }
  }, [action, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Resetuj grešku

    if (!amount || parseFloat(amount) <= 0) {
      setError("Molimo unesite validan iznos donacije.");
      return;
    }
    // Minimalna provjera za karticu - pošto nemamo još definisano za sad samo da ne bude prazno polje
    if (!cardNumber || !expiryDate || !cvv) {
        setError("Molimo popunite sva polja za plaćanje.");
        return;
    }

    setLoading(true);

    try {
      // Dekodiranje tokena 
      let userId = null; // Podrazumijevana vrijednost ako je gost u pitanju

      if (authState.accessToken) {
        try {
          const decoded = jwtDecode(authState.accessToken);
          userId = decoded.id; // Uzmi ID korisnika iz dekodiranog tokena
        } catch (decodeError) {
          console.warn("Greška pri dekodiranju tokena, nastavljam kao anonimni korisnik:", decodeError);
          // Ako token postoji ali je nevažeći, idUser ostaje null
        }
      }

      // Podaci za slanje na backend, mada userId sad i ne treba
      const donationData = {
        idAction: action.idAction,
        idUser: userId, 
        amount: parseFloat(amount),
      };

      console.log("Slanje donacije:", donationData);

      // Slanje zahtjeva na backend koristeći apiRequest
      const data = await apiRequest("donations/adddonation", "POST", authState.accessToken, donationData);

      // Ako je execution stigao ovdje, to znači da je apiRequest bio uspješan
      // i 'data' već sadrži parsirani JSON odgovor od servera.
      console.log("Donacija uspešna:", data);
      alert("Hvala na donaciji!");
      navigate(`/actionview/${action.idAction}`, { state: { action } }); // Vrati se na stranicu akcije

    } catch (err) {
      console.error("Greška kod donacije:", err);
      // 'err' ovdje je greška koju baca apiRequest (koja već sadrži poruku)
      let errorMessage = "Došlo je do neočekivane greške. Pokušajte ponovo.";

      if (err.message) {
          errorMessage = err.message;
      }
      // Otvoreno za implementaciju neke specifične err poruke

      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Prikazuje "Akcija nije pronađena" ako akcija, jelte, nije pronađena
  if (!action) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-100">
        <NavigationBar showSearch={false} />
        <main className="flex-grow px-6 pt-28 pb-16 max-w-6xl mx-auto text-center text-gray-500">
          Akcija nije pronađena.
        </main>
        <InfoFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <NavigationBar showSearch={false} />

      <main className="flex-grow px-6 pt-28 pb-16 max-w-2xl mx-auto w-full">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Donirajte za "{action.name}"
        </h1>

        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="mb-6">
            <label htmlFor="amount" className="block text-gray-700 text-sm font-bold mb-2">
              Iznos donacije (€)
            </label>
            <input
              type="number"
              id="amount"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Npr. 10.00"
              required
            />
          </div>

          <div className="mb-6 border-t pt-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Podaci o kartici (TEST ZA SAD)</h2>
            <div className="mb-4">
              <label htmlFor="cardNumber" className="block text-gray-700 text-sm font-bold mb-2">
                Broj kartice
              </label>
              <input
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))} // Samo brojevi
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="**** **** **** ****"
                maxLength="16"
                required
              />
            </div>
            <div className="flex gap-4 mb-4">
              <div className="w-1/2">
                <label htmlFor="expiryDate" className="block text-gray-700 text-sm font-bold mb-2">
                  Datum isteka (MM/GG)
                </label>
                <input
                  type="text"
                  id="expiryDate"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="MM/GG"
                  maxLength="5"
                  required
                />
              </div>
              <div className="w-1/2">
                <label htmlFor="cvv" className="block text-gray-700 text-sm font-bold mb-2">
                  CVV
                </label>
                <input
                  type="text"
                  id="cvv"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))} // Samo brojevi
                  className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="***"
                  maxLength="4"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-3 px-6 rounded-lg w-full text-lg transition duration-200"
            disabled={loading}
          >
            {loading ? "Obrada..." : "Potvrdi Donaciju"}
          </button>
        </form>
      </main>

      <InfoFooter />
    </div>
  );
}
export default DonateFormPage;