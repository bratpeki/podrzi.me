import React from "react";
import { Link } from "react-router-dom";

const ActionSuggestion = ({ action }) => {
  const percentage = Math.min(
    (action.collected / action.goal) * 100,
    100
  ).toFixed(0);

  return (
    <Link
      to={`/actionView/${action.idAction}`}
      state={action.idAction} 
      className="flex items-center border-b bg-white hover:bg-gray-100 cursor-pointer no-underline"
    >
      <img
        src={action.primaryImage}
        alt={action.name}
        className="w-14 h-14 object-cover rounded mr-2"
      />
      <div className="flex-1">
        <h3 className="text-black font-semibold">{action.name}</h3>
        <div className="w-full bg-blue-200 h-2 rounded mt-1">
          <div
            className="bg-green-500 h-full rounded"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="text-xs text-black">{percentage}% funded</span>
      </div>
    </Link>
  );
};

export default ActionSuggestion;
