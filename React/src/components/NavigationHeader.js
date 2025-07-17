// src/components/NavigationBar.js
import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthStateContext } from "./UseAuthState";
import NotificationDropdown from './NotificationDropdown';
import ActionSearchBar from "./ActionSearchBar";
import ActionSuggestion from "./ActionSuggestion";
// TODO: Preimenovati
function NavigationBar({
  showSearch = true,
  showCreate = true,
  showProfile = true,
  showNotification = true,
  showLogout = true,
}) {
  const { authState, authDispatch } = useContext(AuthStateContext);
  const navigate = useNavigate();
  const [matchingActions, setMatchingActions] = useState([]);

  const handleSearchResults = (results) => {
    setMatchingActions(results);
  };

  const logout = () => {
    authDispatch({ type: "logout" });
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 fixed top-0 w-full p-4 flex items-center justify-between text-white shadow-md z-50 h-20">
      {/* Left: Search bar or placeholder */}

      <div className="w-1/6 h-full">
        {showSearch && (
          <ActionSearchBar
            onResults={setMatchingActions}
            className="relative"
          />
        )}

        <div className="mt-4 space-y-3">
          {matchingActions.map((action) => (
            <ActionSuggestion
              key={action.id}
              action={action}
              className=" overflow-y-auto"
            />
          ))}
        </div>
      </div>

      {/* Center: Title */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <Link to="/home" className="text-5xl font-bold p-4 text-white">
          PODRŽI.ME
        </Link>
      </div>

      {/* Right: Nav links */}
      <div className="space-x-6 flex items-center relative">
        {authState.accessToken != null && showCreate && (
          <Link to="/createAction" className="hover:underline">
            Kreiraj akciju
          </Link>
        )}
        {authState.accessToken != null && showProfile && (
          <Link to="/profilePage" className="hover:underline">
            Profil
          </Link>
        )}
        {authState.accessToken != null && showNotification && (
          <NotificationDropdown />
        )}
        {authState.accessToken != null && showLogout && (
          <button className="hover:underline" onClick={logout}>
            Odjavi se
          </button>
        )}
        {authState.accessToken == null && showLogout && (
          <button className="hover:underline" onClick={logout}>
            Prijavi se
          </button>
        )}
      </div>
    </nav>
  );
}

export default NavigationBar;
