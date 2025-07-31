import { useEffect, useState, useContext } from "react";
import NavigationBar from "../../components/NavigationHeader";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../utility/FetchAPI";
import AdminHeader from "./AdminHeader";
import { Link } from "react-router-dom";
import ActionDropdown from "../../components/ActionDropdown";
import AdminConfirmDialogue from "../../components/AdminConfirmDialogue.js";
import Swal from "sweetalert2";
import { AuthStateContext } from "../../components/UseAuthState.js";

function AdminViewAccounts() {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogVisible, setDialogVisible] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUsername, setSelectedUsername] = useState("");
  const [selectedUserState, setSelectedUserState] = useState(0); // 0 or 1
  const [filterState, setFilterState] = useState(0); // 0 = non-suspended, 1 = suspended, or maybe "all"
  const navigate = useNavigate();
  const { authState } = useContext(AuthStateContext);

  useEffect(() => {
    const func = async () => {
      try {
        const response = await apiRequest("users/getusersstate", "GET");
        setUsers(response);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };
    func();
  }, []);

  const filteredUsers = users.filter((user) => {
    const matchesName = user.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesState =
      filterState === "all" ? true : user.state === filterState;
    return matchesName && matchesState;
  });

  const showNoUsersMessage =
    Object.keys(users).length === 0 && searchTerm === "";

  // Suspend user API call
  const handleSuspendConfirm = async (reason) => {
    try {
      const formData = new FormData();
      formData.append("idUser", selectedUserId);
      formData.append("reason", reason);

      await apiRequest(
        `admins/suspenduser`,
        "POST",
        authState.adminToken,
        formData
      );
      setDialogVisible(false);
      await Swal.fire({
        icon: "success",
        title: "Suspendovanje uspješno",
        text: `Korisnik ${selectedUsername} je suspendovan.`,
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
          showConfirmButton: "button-style",
        }
      });
      await apiRequest(`admins/handle?idUser=${selectedUserId}`,authState.adminToken);
      // Refresh user list after suspend
      const refreshedUsers = await apiRequest("users/getusersstate", "GET");
      setUsers(refreshedUsers);
    } catch (err) {
      setDialogVisible(false);
      console.error("Greška pri suspendovanju korisnika:", err);
      await Swal.fire({
        icon: "error",
        title: "Greška",
        text: "Došlo je do greške pri suspendovanju korisnika.",
      });
    }
  };

  // Remove suspension API call
  const handleRemoveSuspension = async (userId, username) => {
    try {
      await apiRequest(
        `admins/unsuspenduser?idUser=${userId}`,
        "POST",
        authState.adminToken
      );
      await Swal.fire({
        icon: "success",
        title: "Suspenzija uklonjena",
        text: `Korisnik ${username} više nije suspendovan.`,
        timer: 2500,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
          showConfirmButton: "button-style",
        }
      });
      // Refresh user list after removal
      const refreshedUsers = await apiRequest("users/getusersstate", "GET");
      setUsers(refreshedUsers);
    } catch (err) {
      console.error("Greška pri uklanjanju suspenzije:", err);
      await Swal.fire({
        icon: "error",
        title: "Greška",
        text: "Došlo je do greške pri uklanjanju suspenzije korisnika.",
      });
    }
  };

  // Show confirm dialog for suspension
  const openSuspendDialog = (id, username) => {
    setSelectedUserId(id);
    setSelectedUsername(username);
    setDialogVisible(true);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-10 gradient-style">
      <AdminHeader />
      <div className="mt-16" />

      <div className="flex flex-col bg-white rounded-lg shadow-md w-2/5 h-full p-8 mt-2 mb-8 items-center justify-center p-20">
        <h1 className="text-4xl font-bold text-cyan-900 mb-8 drop-shadow-md">
          Pregled korisnika
        </h1>

        {/* Filter buttons */}
        <div className="mb-6 space-x-3">
          <button
            className={`px-4 py-2 rounded ${filterState === 0 ? "bg-cyan-600 text-white" : "bg-gray-200"
              }`}
            onClick={() => setFilterState(0)}
          >
            Aktivni korisnici
          </button>
          <button
            className={`px-4 py-2 rounded ${filterState === 1 ? "bg-cyan-600 text-white" : "bg-gray-200"
              }`}
            onClick={() => setFilterState(1)}
          >
            Suspendovani korisnici
          </button>
          <button
            className={`px-4 py-2 rounded ${filterState === "all" ? "bg-cyan-600 text-white" : "bg-gray-200"
              }`}
            onClick={() => setFilterState("all")}
          >
            Svi korisnici
          </button>
        </div>

        <input
          type="text"
          placeholder="Pretraži po korisničkom imenu..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-6 p-2 border border-gray-300 rounded w-full shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500"
        />

        <div className="flex flex-col items-center w-full">
          {filteredUsers.length > 0 ? (
            <ul className="w-full text-center">
              {filteredUsers.map((user) => {
                const { id, name, state } = user;

                return (
                  <li
                    key={id}
                    className="flex justify-between items-center bg-gray-100 p-3 mb-2 rounded shadow-sm text-lg text-gray-700"
                  >
                    <Link
                      to={`/viewProfile/${id}`}
                      className="text-left text-style hover:underline"
                    >
                      Username: {name} (ID: {id})
                    </Link>

                    <ActionDropdown
                      actions={[
                        {
                          text: "Pregled profila",
                          onClick: () => {
                            navigate(`/viewProfile/${id}`);
                          },
                          type: "normal",
                        },
                        ...(state === 0
                          ? [
                            {
                              text: "Suspenduj profil",
                              onClick: () => openSuspendDialog(id, name),
                              type: "destructive",
                            },
                          ]
                          : [
                            {
                              text: "Ukloni suspenziju",
                              onClick: () =>
                                handleRemoveSuspension(id, name),
                              type: "normal",
                            },
                          ]),
                      ]}
                    />
                  </li>
                );
              })}
            </ul>
          ) : searchTerm !== "" ? (
            <p className="text-gray-600">
              Nema pronađenih korisnika za "{searchTerm}".
            </p>
          ) : (
            showNoUsersMessage && (
              <p className="text-gray-600">Nema pronađenih korisnika.</p>
            )
          )}
        </div>
      </div>

      <AdminConfirmDialogue
        show={dialogVisible}
        title="Suspenduj korisnika"
        message="Da li ste sigurni da želite da suspendujete ovog korisnika?"
        onCancel={() => setDialogVisible(false)}
        onConfirm={(reason) => {
          handleSuspendConfirm(reason);
        }}
        showReasonInput={true}
        reasonLabel="Unesite razlog suspenzije"
      />
    </div>
  );
}

export default AdminViewAccounts;
