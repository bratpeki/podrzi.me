import React from "react";
import { Link } from "react-router-dom";

const ActionSuggestion = ({ action }) => {
  const percentage = Math.min(
    (action.collected / action.goal) * 100,
    100
  ).toFixed(0);
  const id = action.idAction;
  const tags = action.tags?.slice(0, 3) || []; // show only first 3 tags

  return (
    <Link
      to={`/actionView/${action.idAction}`}
      state={{ id }}
      className="flex items-center border-b bg-white hover:bg-gray-100 cursor-pointer no-underline p-2"
    >
      <img
        src={action.primaryImage}
        alt={action.name}
        className="w-14 h-14 object-cover rounded mr-2"
      />
      <div className="flex-1">
        <h3 className="text-black font-semibold">{action.name}</h3>
        <div className="w-full bg-blue-200 h-2 rounded mt-1 mb-1">
          <div
            className="bg-green-500 h-full rounded"
            style={{ width: `${percentage}%` }}
          ></div>
        </div>
        <span className="text-xs text-black block mb-1">
          {percentage}% funded
        </span>
        <div className="flex gap-1 flex-wrap">
          {tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-gray-200 text-xs text-gray-700 px-2 py-0.5 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default ActionSuggestion;
