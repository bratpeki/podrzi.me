import React from "react";
import { Link } from "react-router-dom";

function ActionCard({ action }) {
  const progress = Math.min(
    100,
    (action.collected / action.goal) * 100
  ).toFixed(0);
  const id = action.idAction;

  return (
    <Link
      to={`/actionView/${action.idAction}`}
      state={{ id }}
      className="w-72 bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-200"
    >
      <img
        src={action.primaryImage}
        alt="Slika akcije"
        className="w-full h-40 object-scale-fit"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">{action.name}</h3>
        <p className="text-gray-600 text-sm">{action.desc}</p>
        <p className="text-sm text-gray-600 mt-1">
          Cilj: {action.goal.toLocaleString()}KM
        </p>

        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
          <div
            className={`h-2.5 rounded-full ${
              progress < 50 ? "bg-orange-400" : "bg-green-500"
            }`}
            style={{ width: `${progress}%` }}
          />
        </div>
        <p
          className={`mt-1 text-sm font-medium ${
            progress < 50 ? "text-orange-500" : "text-green-600"
          }`}
        >
          {progress}% prikupljeno
        </p>
      </div>
    </Link>
  );
}

export default ActionCard;
