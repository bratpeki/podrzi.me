import React, { useContext, useEffect, useState } from "react";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import RefundDialog from "../components/RefundDialog";
import { useLocation } from "react-router-dom";
import { AuthStateContext } from "../components/UseAuthState";
import NavigationBar from "../components/NavigationHeader";
import InfoFooter from "../components/InfoFooter";
import { apiRequest } from "../utility/FetchAPI";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

function ViewDonationsPage() {
  const location = useLocation();
  const { idUser } = location.state || {};

  const [dons, setDons] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");

  const [showDialog, setShowDialog] = useState(false);
  const [selectedDonationId, setSelectedDonationId] = useState(null);

  const { authState } = useContext(AuthStateContext);
  const sweetAlert= withReactContent(Swal);

  useEffect(() => {
    const fetchDons = async () => {
      try {
        const res = await apiRequest(
          "donations/getdonationsuser?idUser=" + idUser,
          "GET",
          authState.accessToken
        );
        const responseBodyText = await res;

        if (responseBodyText === "wrongUserError") {
          setResponseMessage("Korisnik nije prepoznat!");
          throw new Error("Korisnik nije prepoznat!");
        }

        const data = responseBodyText;
        for (let i = 0; i < data.length; i++) {
          let resImg = await apiRequest(
            "images/getprimaryimage?idAction=" + data[i].idAction,
            "GET",
            authState.accessToken
          );
          let imgResponse = await resImg;
          data[i].img = imgResponse;
        }

        setDons(data);
      } catch (err) {
        console.error("Greška pri učitavanju donacija:", err.message);
        setResponseMessage("Greška pri učitavanju donacija: " + err.message);
      }
    };

    if (authState?.accessToken) fetchDons();
  }, [authState, idUser]);

  const generateReport = () => {
    if (!dons.length) return;

    const doc = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });

    doc.setFontSize(18);
    doc.text("Pregled donacija", 14, 20);

    autoTable(doc, {
      head: [["Akcija", "Iznos", "Vrijeme"]],
      body: dons.map((d) => [
        d.actionName,
        `${d.amount} KM`,
        new Date(d.donationTime).toLocaleString("bs-BA"),
      ]),
      startY: 28,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [30, 64, 175] },
    });

    doc.save("izvjestaj-donacija.pdf");
  };
  const handleRefund = (donationId) => {
    setSelectedDonationId(donationId);
    setShowDialog(true);
  };

  const confirmRefund = async (reason) => {
    setShowDialog(false);
    if (!reason.trim()) {
       await sweetAlert.fire({
          title: "Neuspješno!",
          text: "Morate unijeti razlog.",
          icon: "error",
          confirmButtonText: "U redu",
        });
      return;
    }

    try {
      const res = await apiRequest(
        "refunds/request",
        "POST",
        authState.accessToken,
        {
          idDonation: selectedDonationId,
          reason: reason,
        }
      );

      if (res === "success") {
       await sweetAlert.fire({
          title: "Uspješno!",
          text: "Povrat je zatražen.",
          icon: "success",
          confirmButtonText: "U redu",
        });
      } else {
        await sweetAlert.fire({
          title: "Greška!",
          text: res,
          icon: "error",
          confirmButtonText: "U redu",
        });
      }
    } catch (err) {
      console.error("Greška pri zahtjevu za povrat:", err);
        await sweetAlert.fire({
          title: "Neuspejšno!",
          text: "Došlo je do greške.",
          icon: "error",
          confirmButtonText: "U redu",
        }); 
    }
  };

  return (
    <div className="min-h-screen flex flex-col gradient-style">
      {/* Navigation Bar */}
      <NavigationBar showSearch={false} />

      <header className="text-center mt-12 mb-6 pt-10">
        <h1 className="text-5xl font-bold text-gray-800">
          Pregled doniranim akcijama
        </h1>
      </header>

      <div className="flex justify-center mb-6">
        <button
          onClick={generateReport}
          className="button-style font-medium "
        >
          Generiši Izvještaj
        </button>
      </div>

      {responseMessage && (
        <p className="text-center text-sm text-red-600 mb-2">
          {responseMessage}
        </p>
      )}

      {/* Margina se stavlja na bottom da blok ne upada u footer */}
      <div className="mb-14 w-1/2 mx-auto">
        {dons.map((donation) => (
          <div key={donation.idDonation} className="w-full">
            <Link
              to={`/actionView/${donation.idAction}`}
              state={{ id: donation.idAction }}
              className="block"
            >
              <div className="bg-white rounded-lg shadow-md p-6 mb-2 border border-gray-200 hover:bg-gray-200 flex justify-between items-center">
                <div className="w-2/3">
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    Akcija: {donation.actionName}
                  </h3>
                  <p className="text-gray-700 mb-1">
                    <span className="font-medium">Iznos donacije:</span>{" "}
                    {donation.amount} KM
                  </p>
                  <p className="text-gray-600 text-sm">
                    <span className="font-medium">Vrijeme donacije:</span>{" "}
                    {new Date(donation.donationTime).toLocaleString()}
                  </p>
                </div>
                <img
                  src={donation.img}
                  alt={`Image for ${donation.actionName}`}
                  className="h-48 w-1/3 object-cover rounded-md ml-4"
                />
              </div>
            </Link>

            {/* Refund button directly below each card */}
            <div className="flex justify-end mb-6">
              <button
                onClick={() => handleRefund(donation.idDonation)}
                className="bg-red-500 hover:bg-red-600 text-white text-sm px-4 py-2 rounded shadow"
              >
                Zatraži povrat
              </button>
            </div>
          </div>
        ))}
      </div>
      {/* Footer */}
      <InfoFooter />
      <RefundDialog
        show={showDialog}
        onClose={() => setShowDialog(false)}
        onConfirm={confirmRefund}
      />
    </div>
  );
}

export default ViewDonationsPage;
