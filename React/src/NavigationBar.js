// src/components/NavigationBar.js
import React from 'react';
import { Link } from 'react-router-dom';

function NavigationBar({ showSearch = true }) {
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
        <Link to="/home" className="text-5xl font-bold p-4 text-white">PODRŽI.ME</Link>
      </div>

      {/* Right: Nav links */}
      <div className="space-x-6">
        <Link to="/createAction" className="hover:underline">
          Kreiraj akciju
        </Link>
        <Link to="/profilePage" className="hover:underline">
          Profil
        </Link>
        <Link to="/notifications" className="hover:underline">
          Notifikacije
        </Link>
        <Link to="/login" className="hover:underline">
          Odjavi se
        </Link>
      </div>
    </nav>
  );
}

export default NavigationBar;
