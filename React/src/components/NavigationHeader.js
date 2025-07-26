// src/components/NavigationBar.js
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthStateContext } from "./UseAuthState";
import NotificationDropdown from "./NotificationDropdown";
import ActionSearchBar from "./ActionSearchBar";
import ActionSuggestion from "./ActionSuggestion";
import { jwtDecode } from "jwt-decode";
import logo from "../Images/logo.png";
import defaultUser from "../Images/defaultUser.png";
import { apiRequest } from "../utility/FetchAPI.js";

function NavigationBar({ showSearch = true, showNotification = true }) {
  const { authState, authDispatch } = useContext(AuthStateContext);
  const navigate = useNavigate();
  const [matchingActions, setMatchingActions] = useState([]);
  const [userData, setUserData] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();

  const userId = authState?.accessToken
    ? jwtDecode(authState.accessToken).id
    : null;

  const handleSearchResults = (results) => {
    setMatchingActions(results);
  };

  const logout = () => {
    authDispatch({ type: "logout" });
    navigate("/login");
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    if (authState.accessToken) {
      (async () => {
        const res = await apiRequest(
          "users/showprofile",
          "GET",
          authState.accessToken
        );
        setUserData(res);
      })();
    }
  }, [authState.accessToken]);

  useEffect(() => {
    document.addEventListener("mousedown", closeDropdown);
    return () => {
      document.removeEventListener("mousedown", closeDropdown);
    };
  }, []);

  return (
    <nav className="bg-cyan-500 fixed top-0 w-full p-4 flex items-center justify-between text-white shadow-md z-50 h-20">
      {/* Left: Search bar and suggestions */}
      <div className="w-1/4 h-full">
        {showSearch && (
          <ActionSearchBar
            onResults={setMatchingActions}
            className="relative"
          />
        )}

        {matchingActions.length > 0 && (
          <div className="mt-1 bg-white rounded-lg shadow p-3">
            <div className="space-y-3">
              {matchingActions.map((action) => (
                <ActionSuggestion
                  key={action.id}
                  action={action}
                  className="overflow-y-auto"
                />
              ))}
            </div>
          </div>
        )}
      </div>
      {/* Center: Logo */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
        <Link
          to="/home"
          className="flex items-center gap-3 text-white no-underline text-6xl font-extrabold drop-shadow-md"
        >
          <img
            src={logo}
            alt="Logo"
            className="h-14 w-auto object-contain p-2"
          />
          PODRŽI.ME
        </Link>
      </div>

      {/* Right: Profile picture + dropdown */}
      <div className="space-x-6 flex items-center relative font-bold drop-shadow-md z-20">
        {authState.accessToken && showNotification && <NotificationDropdown />}

        {authState.accessToken && userData && (
          <div className="relative" ref={dropdownRef}>
            <img
              src={userData.imagePath || defaultUser}
              alt="Profile"
              className="h-16 w-16 rounded-full cursor-pointer object-fit border-2 border-gray-500 hover:border-white"
              onClick={toggleDropdown}
            />
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-cyan-500 text-white rounded-md shadow-lg py-2 z-30">
                <Link
                  to={`/viewProfile/${userId}`}
                  state={{ id: userId }}
                  className="block px-4 py-2 hover:bg-cyan-700"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profil
                </Link>
                <Link
                  to="/createAction"
                  className="block px-4 py-2 hover:bg-cyan-700"
                  onClick={() => setDropdownOpen(false)}
                >
                  Kreiraj akciju
                </Link>
                <button
                  onClick={logout}
                  className="block w-full text-left px-4 py-2 hover:bg-cyan-700"
                >
                  Odjavi se
                </button>
              </div>
            )}
          </div>
        )}

        {/* Show login button if not logged in */}
        {!authState.accessToken && (
          <button
            className="hover:underline"
            onClick={() => navigate("/login")}
          >
            Prijavi se
          </button>
        )}
      </div>
    </nav>
  );
}

export default NavigationBar;
