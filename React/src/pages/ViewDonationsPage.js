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
import noImagePlaceholder from "../Images/noImagePlaceholder.png";

function ViewDonationsPage() {
  const location = useLocation();
  const { idUser } = location.state || {};

  const [dons, setDons] = useState([]);
  const [responseMessage, setResponseMessage] = useState("");

  const [showDialog, setShowDialog] = useState(false);
  const [selectedDonationId, setSelectedDonationId] = useState(null);

  const { authState } = useContext(AuthStateContext);
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
          try {
            const resImg = await apiRequest(
              "images/getprimaryimage?idAction=" + data[i].idAction,
              "GET",
              authState.accessToken
            );

            const imgUrl = typeof resImg === "string" ? resImg.trim() : "";

            data[i].img = imgUrl !== "" ? imgUrl : noImagePlaceholder;
          } catch (err) {
            console.warn("Image fetch failed:", err);
            data[i].img = noImagePlaceholder;
          }
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
      await Swal.fire({
        icon: "warning",
        title: "Unesite razlog",
        text: "Morate unijeti razlog za povrat donacije.",
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
        await Swal.fire({
          icon: "success",
          title: "Zahtjev poslan",
          text: "Zahtjev za povrat je uspješno poslan.",
          timer: 2500,
          showConfirmButton: false,
          timerProgressBar: true,
        });
      } else {
        await Swal.fire({
          icon: "error",
          title: "Greška",
          text: "Greška: " + res,
        });
      }
    } catch (err) {
      console.error("Greška pri zahtjevu za povrat:", err);
      await Swal.fire({
        icon: "error",
        title: "Greška",
        text: "Došlo je do greške prilikom slanja zahtjeva.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <NavigationBar showSearch={false} />

      <header className="text-center mt-12 mb-6 pt-10">
        <h1 className="text-5xl font-bold text-gray-800">
          Pregled doniranim akcijama
        </h1>
      </header>

      <div className="flex justify-center mb-6">
        <button
          onClick={generateReport}
          className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium py-2 px-4 rounded"
        >
          Generiši Izvještaj
        </button>
      </div>

      {responseMessage && (
        <p className="text-center text-sm text-red-600 mb-2">
          {responseMessage}
        </p>
      )}

      <div className="mb-14 w-1/2 mx-auto">
        {dons
          .filter((donation) => donation.refunded === false)
          .map((donation) => (
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
                    src={donation.img || noImagePlaceholder}
                    alt={`Image for ${donation.actionName}`}
                    className="h-48 w-1/3 object-fit rounded-md ml-4"
                  />
                </div>
              </Link>

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
