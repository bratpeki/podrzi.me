import React from 'react';
import { useLocation } from 'react-router-dom';

function ActionViewPage() {
  const location = useLocation();
  const { action } = location.state || {};

  if (!action) {
    return <div className="p-8 text-center text-xl text-red-600">Akcija nije pronađena.</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">{action.name}</h1>
      <img
        src="https://via.placeholder.com/600x300?text=Slika+akcije"
        alt="Slika akcije"
        className="mb-6 w-full max-w-3xl object-cover rounded shadow"
      />
      <p className="text-lg text-gray-700 mb-2">{action.desc}</p>
      <p className="text-md text-gray-600">Cilj: {action.goal.toLocaleString()}€</p>
      <p className="text-md text-gray-600">Prikupljeno: {action.collected.toLocaleString()}€</p>
    </div>
  );
}

export default ActionViewPage;
