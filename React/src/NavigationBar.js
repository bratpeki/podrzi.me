// src/NavigationBar.js
import React from 'react';
import { Link } from 'react-router-dom';

function NavigationBar({ showSearch = true }) {
  return (
    <nav className="bg-gray-800 p-4 flex justify-between items-center text-white">
      {showSearch && (
        <input
          type="text"
          placeholder="Pretraga akcija"
          className="p-2 rounded-md w-1/3 text-black"
        />
      )}
      <div className={`space-x-6 ${!showSearch ? 'ml-auto' : ''}`}>
        <Link to="/createAction" className="hover:underline">
          Kreiraj akciju
        </Link>
        <Link to="/profile" className="hover:underline">
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
