import React, { useState, useEffect } from 'react';
import { apiRequest } from '../utility/FetchAPI';

const ActionSearchBar = ({ onResults }) => {
  const [input, setInput] = useState('');
  const [debouncedInput, setDebouncedInput] = useState('');

  // Debounce logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedInput(input);
    }, 300); // Adjust delay as needed (300ms is common)

    return () => clearTimeout(timer);
  }, [input]);

  // API call when input stabilizes
  useEffect(() => {
    const fetchActions = async () => {
      if (debouncedInput.trim() === '') {
        if (typeof onResults === 'function') onResults([]);
        return;
      }

      try {
        const response = await apiRequest("actions/searchactions?input=" + debouncedInput, "GET");
        if (typeof onResults === 'function') onResults(response);
      } catch (error) {
        console.error('Error fetching actions:', error);
      }
    };

    fetchActions();
  }, [debouncedInput, onResults]);

  return (
    <input
      type="text"
      placeholder="Pretražite akcije..."
      className="px-4 py-2 text-black border rounded w-full"
      value={input}
      onChange={(e) => setInput(e.target.value)}
    />
  );
};

export default ActionSearchBar;
