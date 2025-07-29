import React, { useState, useEffect, useRef } from "react";
import { apiRequest } from "../utility/FetchAPI";
import ActionSuggestion from "./ActionSuggestion"; // import this here

const ActionSearchBar = ({ onResults }) => {
  const [input, setInput] = useState("");
  const [debouncedInput, setDebouncedInput] = useState("");
  const [results, setResults] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const containerRef = useRef(null);

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInput(input);
    }, 300);
    return () => clearTimeout(timer);
  }, [input]);

  // Fetch on input change
  useEffect(() => {
    const fetchActions = async () => {
      if (debouncedInput.trim() === "") {
        setResults([]);
        if (onResults) onResults([]);
        return;
      }

      const cleanedInput = debouncedInput.startsWith("#")
        ? debouncedInput.slice(1)
        : debouncedInput;

      try {
        const response = await apiRequest(
          "actions/searchactions?input=" + encodeURIComponent(cleanedInput),
          "GET"
        );
        setResults(response);
        setShowSuggestions(true);
        if (onResults) onResults(response);
      } catch (error) {
        console.error("Error fetching actions:", error);
        setResults([]);
        setShowSuggestions(false);
      }
    };

    fetchActions();
  }, [debouncedInput, onResults]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-xl mx-auto" ref={containerRef}>
      <input
        type="text"
        placeholder="Pretražite akcije..."
        className="px-4 py-2 text-black border rounded w-full"
        value={input}
        onChange={(e) => {
          setInput(e.target.value);
          setShowSuggestions(true);
        }}
        onFocus={() => {
          if (results.length > 0) setShowSuggestions(true);
        }}
      />

      {showSuggestions && results.length > 0 && (
        <div className="absolute z-10 w-full mt-2 bg-white border rounded shadow max-h-96 overflow-y-auto">
          {results.map((action) => (
            <ActionSuggestion key={action.idAction} action={action} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ActionSearchBar;
