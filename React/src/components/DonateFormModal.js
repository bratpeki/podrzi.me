import React, { useState, useContext, useEffect } from "react";
import { AuthStateContext } from "../components/UseAuthState.js"; // Prilagodi putanju ako je potrebno
import { apiRequest } from "../utility/FetchAPI.js";
import { jwtDecode } from "jwt-decode";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

// Props:
// - action: Objekat akcije (currentAction iz ActionViewPage)
// - onClose: Funkcija za zatvaranje modala
// - onDonationSuccess: Funkcija koja se poziva nakon uspješne donacije
function DonateFormModal({ action, onClose, onDonationSuccess }) {
  const { authState } = useContext(AuthStateContext);

  const [amount, setAmount] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [cvv, setCvv] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const sweetAlert= withReactContent(Swal);

  // Reset forme kad se pop up zatvori ili otvori
  useEffect(() => {
    setAmount("");
    setCardNumber("");
    setExpiryDate("");
    setCvv("");
    setError("");
    setLoading(false);
  }, [action]); // Resetuj kad se akcija mijenja ili se modal 'ponovo otvori' sa istom akcijom

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!amount || parseFloat(amount) <= 0) {
      setError("Molimo unesite validan iznos donacije.");
      return;
    }
    if (!cardNumber || !expiryDate || !cvv) {
      setError("Molimo popunite sva polja za plaćanje.");
      return;
    }

    setLoading(true);

    try {
      let userId = 58;
      if (authState.accessToken) {
        try {
          const decoded = jwtDecode(authState.accessToken);
          userId = decoded.id;
        } catch (decodeError) {
          console.warn(
            "Greška pri dekodiranju tokena, nastavljam kao anonimni korisnik:",
            decodeError
          );
        }
      }

      const donationData = {
        idAction: action.idAction,
        idUser: userId,
        amount: parseFloat(amount),
      };

      console.log("Slanje donacije:", donationData);

      const data = await apiRequest(
        "donations/adddonation",
        "POST",
        authState.accessToken,
        donationData
      );

      console.log("Donacija uspešna:", data);

     await sweetAlert.fire({
          title: "Uspješno!",
          text: "Hvala na donaciji!",
          icon: "success",
          confirmButtonText: "U redu",
        });

    //  alert("Hvala na donaciji!"); // Možemo ovdje sweet alert koristiti za ljepšti pop up npr

      onDonationSuccess(); // Callback za refresh podataka u roditeljskoj akciji
      onClose();
    } catch (err) {
      console.error("Greška kod donacije:", err);
      let errorMessage = "Došlo je do neočekivane greške. Pokušajte ponovo.";
      if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // JSX za modalnu formu
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-filter backdrop-blur-md">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl font-bold"
        >
          &times;
        </button>
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Donirajte za "{action.name}"
        </h2>

        <form onSubmit={handleSubmit} className="p-2">
          {error && (
            <div
              className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
              role="alert"
            >
              <span className="block sm:inline">{error}</span>
            </div>
          )}

          <div className="mb-6">
            <label
              htmlFor="amount"
              className="block text-gray-700 text-sm font-bold mb-2"
            >
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
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Podaci o kartici (TEST ZA SAD)
            </h3>
            <div className="mb-4">
              <label
                htmlFor="cardNumber"
                className="block text-gray-700 text-sm font-bold mb-2"
              >
                Broj kartice
              </label>
              <input
                type="text"
                id="cardNumber"
                value={cardNumber}
                onChange={(e) =>
                  setCardNumber(e.target.value.replace(/\D/g, ""))
                }
                className="shadow appearance-none border rounded w-full py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                placeholder="**** **** **** ****"
                maxLength="16"
                required
              />
            </div>
            <div className="flex gap-4 mb-4">
              <div className="w-1/2">
                <label
                  htmlFor="expiryDate"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
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
                <label
                  htmlFor="cvv"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  CVV
                </label>
                <input
                  type="text"
                  id="cvv"
                  value={cvv}
                  onChange={(e) => setCvv(e.target.value.replace(/\D/g, ""))}
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
      </div>
    </div>
  );
}

export default DonateFormModal;
