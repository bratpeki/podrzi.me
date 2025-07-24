// src/InfoFooter.js
import React from "react";
import { Link } from "react-router-dom";

function InfoFooter() {
  return (
    <footer className="bg-cyan-500 text-white py-3 bottom-0 w-full z-50 shadow-inner font-bold drop-shadow-md">
      <div className="container mx-auto px-4 flex justify-center space-x-6 text-sm">
        <Link to="/vodic" className="hover:underline">
          Vodič 
        </Link>
        <Link to="/about" className="hover:underline">
          O nama
        </Link>
        <Link to="/contact" className="hover:underline">
          Kontakt
        </Link>
        <Link to="/tos" className="hover:underline">
          Uslovi korišćenja
        </Link>
        <Link to="/review" className="hover:underline">
          Napravi Recenziju
        </Link>
      </div>
    </footer>
  );
}

export default InfoFooter;
