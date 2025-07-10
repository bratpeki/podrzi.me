// src/HomePage.js
import React from 'react';
import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
      <h1 className="text-4xl font-bold text-cyan-700 mb-6">Welcome to PODRZI.ME</h1>

      <p className="text-lg text-gray-700 mb-8 text-center px-4">
        This is the homepage. Dobar xd
      </p>
    </div>
  );
}

export default HomePage;
