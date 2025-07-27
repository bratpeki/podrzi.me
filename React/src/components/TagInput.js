// TagInput.jsx
import React from "react";

function TagInput({ tags, setTags }) {
  const [input, setInput] = React.useState("");

  const handleChange = (e) => {
    setInput(e.target.value);
  };

  const handleKeyDown = (e) => {
    if ((e.key === " " || e.key === "Enter") && input.trim() !== "") {
      e.preventDefault();
      const newTag = input.trim();
      if (!tags.includes(newTag)) {
        setTags([...tags, newTag]);
      }
      setInput("");
    }
  };

  const handleRemove = (tagToRemove) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  return (
    <div className="relative w-full max-w-md">
      <input
        type="text"
        value={input}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Dodaj tag i pritisni SPACE ili ENTER"
        className="w-full p-2 border rounded"
      />
      <div className="mt-2 flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span
            key={index}
            className="bg-cyan-100 text-cyan-800 px-3 py-1 rounded-full flex items-center"
          >
            {tag}
            <button
              onClick={() => handleRemove(tag)}
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

export default TagInput;
