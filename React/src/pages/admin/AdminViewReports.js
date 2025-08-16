import { useCallback, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../utility/FetchAPI";
import AdminHeader from "./AdminHeader";
import Swal from "sweetalert2";
import { AuthStateContext } from "../../components/UseAuthState";
import ActionDropdown from "../../components/ActionDropdown";
import AdminConfirmDialogue from "../../components/AdminConfirmDialogue";

function AdminViewReports() {
  const [detailedReports, setDetailedReports] = useState([]); // reports with fetched detail info
  const [searchTerm, setSearchTerm] = useState("");
  const { authState } = useContext(AuthStateContext);
  const navigate = useNavigate();

  // Confirm dialog state
  const [confirmDialog, setConfirmDialog] = useState({
    show: false,
    title: "",
    message: "",
    onConfirm: null,
    onCancel: null,
    showReasonInput: false,
  });
  const fetchReportsWithDetails = useCallback(async () => {
    try {
      const allReports = await apiRequest(
        "reports/getallunhandled",
        "GET",
        authState.adminToken
      );
      const withDetails = await Promise.all(
        allReports.map(fetchReportedEntity)
      );
      setDetailedReports(withDetails);
    } catch (err) {
      console.error("Failed to fetch reports:", err);
    }
  }, [authState.adminToken]);

  // Helper to fetch reported entity info
  async function fetchReportedEntity(report) {
    try {
      if (report.idUserReported) {
        const user = await apiRequest(
          `users/showuserprofile?idUser=${report.idUserReported}`,
          "GET",
          authState.adminToken
        );
        return { ...report, reportedEntity: user, entityType: "user" };
      } else if (report.idActionReported) {
        const action = await apiRequest(
          `actions/getaction?idAction=${report.idActionReported}`,
          "GET",
          authState.adminToken
        );
        return { ...report, reportedEntity: action, entityType: "action" };
      } else if (report.idCommentReported) {
        const comment = await apiRequest(
          `comments/getbyid?idComment=${report.idCommentReported}`,
          "GET",
          authState.adminToken
        );
        return { ...report, reportedEntity: comment, entityType: "comment" };
      } else {
        return { ...report, reportedEntity: null, entityType: null };
      }
    } catch (error) {
      console.error("Failed to fetch reported entity:", error);
      return { ...report, reportedEntity: null, entityType: null };
    }
  }

  // Fetch all reports + details on mount or when token changes
  useEffect(() => {
    if (authState.adminToken) {
      fetchReportsWithDetails();
    }
  }, [authState.adminToken, fetchReportsWithDetails]);

  // Helper to open confirm dialogs
  function openConfirmDialog({
    title,
    message,
    onConfirm,
    onCancel,
    showReasonInput = false,
  }) {
    setConfirmDialog({
      show: true,
      title,
      message,
      onConfirm: (reason) => {
        setConfirmDialog((prev) => ({ ...prev, show: false }));
        onConfirm(reason);
      },
      onCancel: () => {
        setConfirmDialog((prev) => ({ ...prev, show: false }));
        if (onCancel) onCancel();
      },
      showReasonInput,
    });
  }

  // Action handlers using confirm dialog + SweetAlert for results

  const handleSuspendUser = (userId, reportId) => {
    openConfirmDialog({
      title: "Da li ste sigurni da želite suspendovati korisnika?",
      message:
        "Ova akcija će suspendovati korisnika i on neće moći pristupiti sistemu.",
      showReasonInput: false,
      onConfirm: async () => {
        try {
          const formData = new FormData();
          formData.append("idUser", userId);

          await apiRequest(
            `admins/suspenduser`,
            "POST",
            authState.adminToken,
            formData
          );
          Swal.fire("Suspendovan!", "Korisnik je suspendovan.", "success");
          await apiRequest(
            `admins/handle?idReport=${reportId}`,
            "POST",
            authState.adminToken
          );
          fetchReportsWithDetails();
        } catch {
          Swal.fire("Greška", "Neuspjela akcija suspendovanja.", "error");
        }
      },
    });
  };

  const handleDeleteAction = (actionId, reportId) => {
    openConfirmDialog({
      title: "Da li ste sigurni da želite obrisati akciju?",
      message: "Ova akcija će trajno obrisati prijavljenu akciju.",
      showReasonInput: false,
      onConfirm: async () => {
        try {
          await apiRequest(
            `admins/removeaction?idAction=${actionId}`,
            "POST",
            authState.adminToken,
            {
              idAction: actionId,
            }
          );
          Swal.fire("Obrisano!", "Akcija je obrisana.", "success");
          await apiRequest(
            `admins/handle?idReport=${reportId}`,
            "POST",
            authState.adminToken
          );
          fetchReportsWithDetails();
        } catch {
          Swal.fire("Greška", "Neuspjelo brisanje akcije.", "error");
        }
      },
    });
  };

  const handleDeleteComment = (commentId, reportId) => {
    openConfirmDialog({
      title: "Da li ste sigurni da želite obrisati komentar?",
      message: "Ova akcija će trajno obrisati prijavljeni komentar.",
      showReasonInput: false,
      onConfirm: async () => {
        try {
          await apiRequest(
            `admins/removecomment?idComment=${commentId}`,
            "POST",
            authState.adminToken
          );
          Swal.fire("Obrisano!", "Komentar je obrisan.", "success");
          await apiRequest(
            `admins/handle?idReport=${reportId}`,
            "POST",
            authState.adminToken
          );
          fetchReportsWithDetails();
        } catch {
          Swal.fire("Greška", "Neuspjelo brisanje komentara.", "error");
        }
      },
    });
  };

  // Filter reports by search term (by reporting user or reported entity)
  const filteredReports = detailedReports
    .filter((report) => report.reportedEntity !== null) // ✅ ignore missing data
    .filter((report) => {
      const searchLower = searchTerm.toLowerCase();
      return (
        report.userReportee?.username?.toLowerCase().includes(searchLower) ||
        (report.reportedEntity &&
          (report.reportedEntity.username
            ?.toLowerCase()
            .includes(searchLower) ||
            report.reportedEntity.name?.toLowerCase().includes(searchLower) ||
            report.reportedEntity.title?.toLowerCase().includes(searchLower) ||
            report.reportedEntity.text?.toLowerCase().includes(searchLower)))
      );
    });

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-10 gradient-style">
      <AdminHeader />
      <div className="mt-16" />

      <div className="flex flex-col bg-white rounded-lg shadow-md w-3/5 h-full p-8 mt-2 mb-8 items-center justify-center p-20 max-w-6xl">
        <h1 className="text-4xl font-bold text-cyan-900 mb-8 drop-shadow-md">
          Pregled prijava
        </h1>

        <input
          type="text"
          placeholder="Pretraži po korisničkom imenu ili imenu prijavljenog..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-6 p-2 border border-gray-300 rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />

        <div className="flex flex-col items-center w-full max-h-[600px] overflow-y-auto">
          {filteredReports.length > 0 ? (
            <ul className="w-full text-left space-y-4">
              {filteredReports.map((report) => (
                <li
                  key={report.idReport}
                  className="bg-gray-100 p-4 rounded shadow-sm text-gray-800"
                >
                  <div className="flex justify-between items-center mb-2">
                    <div>
                      <strong>Prijavio:</strong>{" "}
                      {report.userReportee?.username || "Nepoznato"} (ID:{" "}
                      {report.userReportee?.idUser || "N/A"})
                    </div>
                    <ActionDropdown
                      actions={[
                        {
                          text: "Pregled profila prijavitelja",
                          onClick: () =>
                            navigate(
                              `/viewProfile/${report.userReportee?.idUser}`
                            ),
                          type: "normal",
                        },
                        ...(report.entityType === "user"
                          ? [
                              {
                                text: "Suspenduj korisnika",
                                onClick: () =>
                                  handleSuspendUser(
                                    report.idUserReported,
                                    report.idReport
                                  ),
                                type: "destructive",
                              },
                            ]
                          : []),
                        ...(report.entityType === "action"
                          ? [
                              {
                                text: "Obriši akciju",
                                onClick: () =>
                                  handleDeleteAction(
                                    report.idActionReported,
                                    report.idReport
                                  ),
                                type: "destructive",
                              },
                            ]
                          : []),
                        ...(report.entityType === "comment"
                          ? [
                              {
                                text: "Obriši komentar",
                                onClick: () =>
                                  handleDeleteComment(
                                    report.idCommentReported,
                                    report.idReport
                                  ),
                                type: "destructive",
                              },
                            ]
                          : []),
                      ]}
                    />
                  </div>
                  <p className="text-sm text-gray-700 mb-1">
                    <strong>Razlog prijave:</strong> {report.text}
                  </p>

                  {/* Display reported entity info */}
                  <div className="bg-white border rounded p-3 mt-3">
                    {report.reportedEntity ? (
                      <>
                        {report.entityType === "user" && (
                          <>
                            <p>
                              <strong>Korisničko ime:</strong>{" "}
                              {report.reportedEntity.username}
                            </p>
                            <p>
                              <strong>Datum:</strong>{" "}
                              {new Date(
                                report.created
                              ).toLocaleString("en-GB")}
                            </p>
                          </>
                        )}
                        {report.entityType === "action" && (
                          <>
                            <p>
                              <strong>Naziv akcije:</strong>{" "}
                              {report.reportedEntity.name || "Obrisana akcija"} 
                            </p>
                            <p>
                              <strong>Datum:</strong>{" "}
                              {new Date(
                                report.created
                              ).toLocaleString("en-GB")}
                            </p>
                          </>
                        )}
                        {report.entityType === "comment" && (
                          <>
                            <p>
                              <strong>Korisnik:</strong>{" "}
                              {report.reportedEntity.displayName}
                            </p>
                            <p>
                              <strong>Komentar:</strong>{" "}
                              {report.reportedEntity.text}
                            </p>
                            <p>
                              <strong>Datum:</strong>{" "}
                              {new Date(
                                report.created
                              ).toLocaleString("en-GB")}
                            </p>
                          </>
                        )}
                      </>
                    ) : (
                      <p>Nema dostupnih informacija.</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">Nema pronađenih prijava.</p>
          )}
        </div>
      </div>

      <AdminConfirmDialogue
        show={confirmDialog.show}
        title={confirmDialog.title}
        message={confirmDialog.message}
        onCancel={confirmDialog.onCancel}
        onConfirm={confirmDialog.onConfirm}
        showReasonInput={confirmDialog.showReasonInput}
      />
    </div>
  );
}

export default AdminViewReports;
