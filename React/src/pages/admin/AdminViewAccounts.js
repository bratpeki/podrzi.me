import { useEffect, useState } from "react";
import NavigationBar from "../../components/NavigationHeader";
import { useNavigate } from "react-router-dom";
import { apiRequest } from "../../utility/FetchAPI";
import AdminHeader from "./AdminHeader";

import ActionDropdown from "../../components/ActionDropdown";

function AdminViewAccounts() {
  const [users, setUsers] = useState({});

  useEffect(() => {
    const func = async () => {
      try {
        const response = await apiRequest("users/getusers", "GET");
        setUsers(response);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    func();
  }, []);

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-start pt-10 gradient-style">
      <AdminHeader></AdminHeader>

      <div className="mt-16"></div>

      <div className="flex flex-col bg-white rounded-lg shadow-md w-2/5 h-full p-8 mt-2 items-center justify-center p-20">
        <h1 className="text-4xl font-bold text-cyan-900 mb-8 drop-shadow-md">
          {" "}
          Pregled korisnika{" "}
        </h1>

        <div className="flex flex-col items-center w-full">
          {Object.entries(users).length > 0 ? (
            <ul className="w-full text-center">
              {Object.entries(users).map(([id, name]) => (
                <li
                  key={id}
                  className="flex justify-between items-center bg-gray-100 p-3 mb-2 rounded shadow-sm text-lg text-gray-700"
                >
                  Username: {name} (ID: {id})
                  <button className="bottom-2 right-2 w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 text-gray-600 text-xl flex items-center justify-center shadow">
                    <ActionDropdown
                      actions={[
                        {
                          text: "Pregled profila",
                          onClick: () => {},
                          type: "normal",
                        },

                        {
                          text: "Suspendovanje profila",
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
            <p className="text-gray-600">Nema pronađenih korisnika.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminViewAccounts;
