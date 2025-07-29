import { useState, useEffect, useRef } from "react";

const ActionDropdown = ({ actions = [] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getTextColorClass = (type) => {
    return type === 'destructive' ? 'text-red-600' : 'text-gray-700';
  };

  const handleActionClick = (actionFn) => {
    actionFn();
    setIsOpen(false);
  };

  if (actions.length === 0) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label="Options"
      >
        &#8226;&#8226;&#8226; {/* Three dots character */}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <ul className="py-1">
            {actions.map((action, index) => (
              action.onClick && (
                <li key={action.text || index}>
                  <button
                    onClick={() => handleActionClick(action.onClick)}
                    className={`block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left ${getTextColorClass(action.type)}`}
                  >
                    {action.text}
                  </button>
                </li>
              )
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ActionDropdown;
