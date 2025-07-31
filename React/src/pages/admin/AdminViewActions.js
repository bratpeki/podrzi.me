import { useEffect, useState, useContext } from "react";
import NavigationBar from "../../components/NavigationHeader";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../../utility/FetchAPI";
import { AuthStateContext } from "../../components/UseAuthState";
import ActionDropdown from "../../components/ActionDropdown";
import AdminHeader from "./AdminHeader";
import AdminConfirmDialogue from "../../components/AdminConfirmDialogue";
import Swal from "sweetalert2";

function AdminViewActions() {
  const navigate = useNavigate();
  const { authState } = useContext(AuthStateContext);
  const [allActions, setAllActions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedAction, setSelectedAction] = useState(null);

  // Fetch actions
  useEffect(() => {
    const fetchActions = async () => {
      try {
        const fetchedActions = await apiRequest(
          "actions/getvisibleactions",
          "GET",
          authState.accessToken
        );
        setAllActions(fetchedActions);
      } catch (err) {
        console.error("Failed to fetch actions:", err);
      }
    };

    fetchActions();
  }, [authState.accessToken]);

  const filteredActions = allActions.filter((action) =>
    action.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const openDeleteDialog = (action) => {
    setSelectedAction(action);
    setDialogVisible(true);
  };

  const handleDeleteAction = async () => {
    try {
      await apiRequest(
        `admins/removeaction?idAction=${selectedAction.idAction}`,
        "POST",
        authState.adminToken,
        {
          idAction: selectedAction.idAction,
        }
      );

      setDialogVisible(false);
      setSelectedAction(null);
      await apiRequest(
        `admins/handle?idAction=${selectedAction.idAction}`,
        "POST",
        authState.adminToken
      );
      // Refresh the actions list
      const refreshedActions = await apiRequest(
        "actions/getvisibleactions",
        "GET",
        authState.accessToken
      );
      setAllActions(refreshedActions);

      await Swal.fire({
        icon: "success",
        title: "Akcija uklonjena",
        text: `Akcija "${selectedAction.name}" je uspješno uklonjena.`,
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
          showConfirmButton: "button-style",
        },
      });
    } catch (error) {
      setDialogVisible(false);
      console.error("Greška pri uklanjanju akcije:", error);
      await Swal.fire({
        icon: "error",
        title: "Greška",
        text: "Došlo je do greške pri uklanjanju akcije.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-10 gradient-style">
      <AdminHeader />

      <div className="mt-16" />

      <div className="flex flex-col bg-white rounded-lg shadow-md w-2/5 h-full p-8 mt-2 items-center justify-center p-20">
        <h1 className="text-4xl font-bold text-cyan-900 mb-8 drop-shadow-md">
          Pregled akcija
        </h1>

        <input
          type="text"
          placeholder="Pretraži po imenu akcije..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-6 p-2 border border-gray-300 rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />

        <div className="flex flex-col items-center w-full">
          {filteredActions.length > 0 ? (
            <ul className="w-full text-center">
              {filteredActions.map((action) => (
                <li
                  key={action.idAction}
                  className="flex justify-between items-center bg-gray-100 p-3 mb-2 rounded shadow-sm text-lg text-gray-700"
                >
                  <div className="text-left">
                    <Link
                      to={`/actionView/${action.idAction}`}
                      state={{ id: action.idAction }}
                      className="text-style hover:underline"
                    >
                      {action.name}
                    </Link>
                    <p className="text-sm text-gray-500">{action.subtitle}</p>
                    <p className="text-xs text-gray-400 mt-1">
                      ID: {action.idAction}
                    </p>
                  </div>

                  <button className="bottom-2 right-2 w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 text-xl flex items-center justify-center shadow">
                    <ActionDropdown
                      actions={[
                        {
                          text: "Pregled akcije",
                          onClick: () =>
                            navigate(`/actionView/${action.idAction}`, {
                              state: { id: action.idAction },
                            }),
                          type: "normal",
                        },
                        {
                          text: "Ukloni akciju",
                          onClick: () => openDeleteDialog(action),
                          type: "destructive",
                        },
                      ]}
                    />
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">Nema pronađenih akcija.</p>
          )}
        </div>
      </div>

      {/* Confirm dialog for deleting action */}
      <AdminConfirmDialogue
        show={dialogVisible}
        title="Potvrda uklanjanja akcije"
        message={`Da li ste sigurni da želite ukloniti akciju "${selectedAction?.name}"?`}
        onCancel={() => {
          setDialogVisible(false);
          setSelectedAction(null);
        }}
        onConfirm={handleDeleteAction}
      />
    </div>
  );
}

export default AdminViewActions;
