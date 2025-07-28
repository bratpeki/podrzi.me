import React from "react";
import ActionCard from "./ActionCard"; 
import { Link } from "react-router-dom"; 

function CategorySection({ categoryName, actions }) {
 
  const displayedActions = actions.slice(0, 3);

  return (
    <div className="mb-10">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-bold text-cyan-800">{categoryName}</h2>
        {actions.length > 3 && ( 
          <Link
            to={`/category/${encodeURIComponent(categoryName)}`} 
            className="text-cyan-600 hover:text-cyan-800 font-semibold flex items-center"
          >
            Prikaži više
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 ml-1"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </Link>
        )}
      </div>
      
      {displayedActions.length === 0 ? (
        <p className="text-gray-500">Trenutno nema akcija u ovoj kategoriji.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedActions.map((action) => (
            <ActionCard key={action.id} action={action} /> 
          ))}
        </div>
      )}
    </div>
  );
}

export default CategorySection;
