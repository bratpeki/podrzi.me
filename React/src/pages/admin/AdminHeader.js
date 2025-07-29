// src/components/NavigationBar.js
import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../../Images/logo.png";

function AdminHeader() {
  return (
    <nav className="bg-cyan-500 fixed top-0 w-full p-4 flex items-center justify-between text-white shadow-md z-50 h-20">
     
      {/* Center: Logo */}
      <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center">
        <Link
          to="/admin/home"
          className="flex items-center gap-3 text-white no-underline text-6xl font-extrabold drop-shadow-md"
        >
          <img
            src={logo}
            alt="Logo"
            className="h-14 w-auto object-contain p-2"
          />
           <span className="hidden sm:inline text-3xl md:text-6xl">PODRŽI.ME</span>
        </Link>
      </div>
    </nav>
  );
}

export default AdminHeader;
