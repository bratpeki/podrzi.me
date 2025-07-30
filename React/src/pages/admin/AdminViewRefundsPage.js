import React, { useEffect, useState, useContext } from "react";
import AdminConfirmDialogue from "../../components/AdminConfirmDialogue";
import { apiRequest } from "../../utility/FetchAPI";
import { AuthStateContext } from "../../components/UseAuthState";
import AdminHeader from "./AdminHeader";

function AdminViewRefundsPage() {
  const [refunds, setRefunds] = useState([]);
  const { authState } = useContext(AuthStateContext);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [dialogVisible, setDialogVisible] = useState(false);
  const [dialogReason, setDialogReason] = useState("");
  const [dialogAction, setDialogAction] = useState(""); 

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await apiRequest(
          "refunds/getallunhandled",
          "GET",
          authState.adminToken,
        );
        setRefunds(response);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      }
    };

    fetchReports();
  }, [authState.adminToken]);

  const handleOpenDialog = (refund, actionType) => {
    setSelectedRefund(refund);
    setDialogAction(actionType);
    setDialogVisible(true);
  };

  const handleConfirm = async () => {
    if (!selectedRefund) return;

    const endpoint =
      dialogAction === "approve" ? "/refunds/approve" : "/refunds/reject";
    try {
      await apiRequest("POST", endpoint, {
        idRefund: selectedRefund.id,
        reason: dialogReason,
      });
      setRefunds((prev) => prev.filter((r) => r.id !== selectedRefund.id));
    } catch (err) {
      console.error("Refund action failed:", err);
    } finally {
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
          Pregled refundacija
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
                      className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                      onClick={() => handleOpenDialog(refund, "approve")}
                    >
                      Odobri
                    </button>
                    <button
                      className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                      onClick={() => handleOpenDialog(refund, "reject")}
                    >
                      Odbij
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
          dialogAction === "approve" ? "odobriti" : "odbit"
        } ovu refundaciju?`}
        onConfirm={handleConfirm}
        onCancel={() => setDialogVisible(false)}
        showReasonInput={true}
        reasonLabel="Unesite razlog suspenzije"
      />
    </div>
  );
}
export default AdminViewRefundsPage;
