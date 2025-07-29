import { useEffect, useState, useContext } from "react";
import NavigationBar from "../../components/NavigationHeader";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../../utility/FetchAPI";
import { AuthStateContext } from "../../components/UseAuthState";
import ActionDropdown from "../../components/ActionDropdown";
import AdminHeader from "./AdminHeader";

function AdminViewActions() {
  const navigate = useNavigate();
  const { authState } = useContext(AuthStateContext);
  const [allActions, setAllActions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

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

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-10 gradient-style">
      <AdminHeader></AdminHeader>

      <div className="mt-16"></div>

      <div className="flex flex-col bg-white rounded-lg shadow-md w-2/5 h-full p-8 mt-2 items-center justify-center p-20">
        <h1 className="text-4xl font-bold text-cyan-900 mb-8 drop-shadow-md">
          Pregled akcija
        </h1>

        {/* Search Input */}
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
                      state={{ id : action.idAction }}
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
                          onClick: () => {},
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
    </div>
  );
}

export default AdminViewActions;
