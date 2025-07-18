import React, { useState } from "react";

function CollaboratorSearch({ displayNames }) {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [selected, setSelected] = useState([]);

  const handleInputChange = (e) => {
    const input = e.target.value;
    setQuery(input);

    // Filter suggestions based on input
    const matches = displayNames.filter((name) =>
      name.toLowerCase().startsWith(input.toLowerCase())
    );
    setSuggestions(matches);
  };

  const handleSelect = (name) => {
    if (!selected.includes(name)) {
      setSelected((prev) => [...prev, name]);
    }
    setQuery("");
    setSuggestions([]);
  };

  const handleRemove = (name) => {
    setSelected((prev) => prev.filter((n) => n !== name));
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
          {suggestions.map((name, idx) => (
            <li
              key={idx}
              className="p-2 hover:bg-gray-200 cursor-pointer"
              onClick={() => handleSelect(name)}
            >
              {name}
            </li>
          ))}
        </ul>
      )}
      <div className="mt-2 flex flex-wrap gap-2">
        {selected.map((name, idx) => (
          <span
            key={idx}
            className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full flex items-center"
          >
            {name}
            <button
              onClick={() => handleRemove(name)}
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
