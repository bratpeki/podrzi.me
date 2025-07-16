// src/components/NavigationBar.js
import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthStateContext } from "./UseAuthState";

// TODO: Preimenovati
function NavigationBar({ showSearch = true, showCreate = true, showProfile = true, showNotification = true, showLogout = true}) {
  const { authState, authDispatch } = useContext(AuthStateContext);
  const navigate = useNavigate();

  const logout = () => {
    authDispatch({ type: "logout" });
    navigate("/login");
  };

  return (
    <nav className="bg-gray-800 fixed top-0 w-full p-4 flex items-center justify-between text-white shadow-md z-50">
      {/* Left: Search bar or placeholder */}
      <div className="w-1/3">
        {showSearch && (
          <input
            type="text"
            placeholder="Pretraga akcija"
            className="p-2 rounded-md w-full text-black"
          />
        )}
      </div>

      {/* Center: Title */}
      <div className="absolute left-1/2 transform -translate-x-1/2">
        <Link to="/home" className="text-5xl font-bold p-4 text-white">
          PODRŽI.ME
        </Link>
      </div>

      {/* Right: Nav links */}
      <div className="space-x-6">
        {showCreate &&
        <Link to="/createAction" className="hover:underline">
          Kreiraj akciju
        </Link>
        }
        {showProfile &&
        <Link to="/profilePage" className="hover:underline">
          Profil
        </Link>
        } 
        {showNotification &&
        <Link to="/notifications" className="hover:underline">
          Notifikacije
        </Link>
        }
        {showLogout &&
        <button className="hover:underline" onClick={logout}>
          Odjavi se
        </button>
        }
      </div>
    </nav>
  );
}

export default NavigationBar;
