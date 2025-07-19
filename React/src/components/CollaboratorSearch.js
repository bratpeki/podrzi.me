import React, { useState, useEffect } from "react";

function CollaboratorSearch({ displayNames, userIds, onChange }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState([]); // array of { id, name }

  const handleInputChange = (e) => {
    const input = e.target.value;
    setQuery(input);

    const matches = displayNames
      .map((name, idx) => ({ name, id: userIds[idx] }))
      .filter(({ name }) => name.toLowerCase().startsWith(input.toLowerCase()));

    setSuggestions(matches);
  };

  const handleSelect = ({ name, id }) => {
    if (!selected.some((item) => item.id === id)) {
      const updated = [...selected, { name, id }];
      setSelected(updated);
      onChange(updated.map((item) => item.id)); // Pass IDs up
    }

    setQuery("");
    setSuggestions([]);
  };

  const handleRemove = (idToRemove) => {
    const updated = selected.filter((item) => item.id !== idToRemove);
    setSelected(updated);
    onChange(updated.map((item) => item.id)); // Update parent
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder="Dodaj saradnika"
        className="w-full p-2 border rounded"
      />
      {suggestions.length > 0 && (
        <ul className="absolute z-10 w-full bg-white border rounded shadow">
          {suggestions.map(({ name, id }) => (
            <li
              key={id}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelect({ name, id })}
            >
              {name}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-2 flex flex-wrap gap-2">
        {selected.map(({ name, id }) => (
          <span
            key={id}
            className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full flex items-center"
          >
            {name}
            <button
              onClick={() => handleRemove(id)}
              className="ml-2 text-red-600 hover:text-red-800"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  );
}

export default CollaboratorSearch;
