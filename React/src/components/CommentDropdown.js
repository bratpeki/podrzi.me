import { useContext, useState, useEffect, useRef } from "react"; // Import useRef

// New CommentDropdown Component
const CommentDropdown = ({
  onReportUser,
  onReportComment,
  onEditComment,
  onDeleteComment,
  commentId,
  userId,
  showReportUser = true,
  showReportComment = true,
  showEditComment = true,
  showDeleteComment = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null); // Ref for the dropdown to handle clicks outside

  // Close dropdown if clicked outside
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

  const handleReportUser = () => {
    onReportUser(userId);
    setIsOpen(false);
  };

  const handleReportComment = () => {
    onReportComment(commentId);
    setIsOpen(false);
  };

   const handleEditComment = () => {
    onEditComment(commentId);
    setIsOpen(false);
  };
    const handleDeleteComment = () => {
    onDeleteComment(commentId);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-500 hover:text-gray-700 focus:outline-none"
        aria-label="Comment options"
      >
        &#8226;&#8226;&#8226; {/* Three dots character */}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
          <ul className="py-1">
            {showReportUser && (
              <li>
                <button
                  onClick={handleReportUser}
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left"
                >
                  Prijavi korisnika
                </button>
              </li>
            )}
            {showReportComment && (
              <li>
                <button
                  onClick={handleReportComment}
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left "
                >
                  Prijavi komentar
                </button>
              </li>
            )}
            {showEditComment && (
              <li>
                <button
                  onClick={handleEditComment}
                  className="block px-4 py-2 text-sm text-black hover:bg-gray-100 w-full text-left "
                >
                  Izmjeni Komentar
                </button>
              </li>
            )}
            {showDeleteComment && (
              <li>
                <button
                  onClick={handleDeleteComment}
                  className="block px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full text-left "
                >
                  Obriši Komentar
                </button>
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

export default CommentDropdown;
