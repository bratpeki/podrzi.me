import React, { useEffect, useState, useContext } from "react";
import AdminConfirmDialogue from "../../components/AdminConfirmDialogue";
import { apiRequest } from "../../utility/FetchAPI";
import { AuthStateContext } from "../../components/UseAuthState";
import AdminHeader from "./AdminHeader";
import Swal from "sweetalert2";

function AdminViewRefundsPage() {
  const [refunds, setRefunds] = useState([]);
  const { authState } = useContext(AuthStateContext);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogReason, setDialogReason] = useState("");
  const [dialogAction, setDialogAction] = useState("");

  // Move fetchReports outside useEffect for reuse
  const fetchReports = async () => {
    try {
      const response = await apiRequest(
        "refunds/getallunhandled",
        "GET",
        authState.adminToken
      );
      const filtered = response.filter((refund) => refund[3] === null);

      setRefunds(filtered);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    }
  };

  useEffect(() => {
    if (authState.adminToken) {
      fetchReports();
    }
  }, [authState.adminToken]);

  const handleOpenDialog = (refund, actionType) => {
    setSelectedRefund(refund);
    setDialogAction(actionType);
    setDialogVisible(true);
  };

  const handleConfirm = async () => {
    console.log("Confirm started");

    if (!selectedRefund) {
      console.warn("No selected refund, aborting.");
      return;
    }

    const endpoint =
      dialogAction === "approve"
        ? `refunds/accept?idRefund=${selectedRefund[0]}`
        : `refunds/deny?idRefund=${selectedRefund[0]}`;

    console.log("Sending request to:", endpoint);
    console.log("With token:", authState.adminToken);

    try {
      await apiRequest(endpoint, "POST", authState.adminToken);
      console.log("Request successful");

      await Swal.fire({
        icon: "success",
        title:
          dialogAction === "approve"
            ? "Refundacija odobrena"
            : "Refundacija odbijena",
        text: `Refundacija je uspješno ${
          dialogAction === "approve" ? "odobrena" : "odbijena"
        }.`,
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
      });
      await fetchReports();
    } catch (err) {
      console.error("Refund action failed:", err);
      await Swal.fire({
        icon: "error",
        title: "Greška",
        text: "Došlo je do greške pri obradi refundacije.",
      });
    } finally {
      console.log("Cleaning up...");
      setDialogVisible(false);
      setSelectedRefund(null);
      setDialogReason("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center pt-10 gradient-style">
      <AdminHeader></AdminHeader>

      <div className="mt-16"></div>

      <div className="flex flex-col bg-white rounded-lg shadow-md w-2/5 p-10 items-center justify-center">
        <h1 className="text-4xl font-bold text-cyan-900 mb-8 drop-shadow-md">
          Pregled zahtjeva za povrat novca
        </h1>

        <div className="flex flex-col items-center w-full">
          {refunds.length > 0 ? (
            <ul className="w-full text-center">
              {refunds.map((refund) => (
                <li
                  key={refund.id}
                  className="flex flex-col bg-gray-100 p-4 mb-4 rounded shadow-sm text-left text-gray-800"
                >
                  <div className="mb-2">
                    <strong>Korisnik:</strong> {refund[5]}
                  </div>
                  <div className="mb-2">
                    <strong>Akcija:</strong> {refund[6]}
                  </div>
                  <div className="mb-2">
                    <strong>Iznos:</strong> {refund[4]} KM
                  </div>
                  <div className="mb-2">
                    <strong>Razlog:</strong> {refund[1]}
                  </div>
                  <div className="flex gap-4 mt-2 justify-center">
                    <button
                      className="button-style px-4 py-2 "
                      onClick={() => handleOpenDialog(refund, "approve")}
                    >
                      Odobri
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => handleOpenDialog(refund, "reject")}
                    >
                      Ukloni
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">Nema refundacija za prikaz.</p>
          )}
        </div>
      </div>

      <AdminConfirmDialogue
        show={dialogVisible}
        title={
          dialogAction === "approve"
            ? "Potvrda odobravanja"
            : "Potvrda odbijanja"
        }
        message={`Da li ste sigurni da želite ${
          dialogAction === "approve" ? "odobriti" : "odbiti"
        } ovu refundaciju?`}
        onConfirm={handleConfirm}
        onCancel={() => setDialogVisible(false)}
        confirmButtonClass={
          dialogAction === "approve"
            ? "button-style"
            : "bg-red-600 hover:bg-red-700"
        }
      />
    </div>
  );
}
export default AdminViewRefundsPage;
