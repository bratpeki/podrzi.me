import React, { useState, useEffect } from "react";

const AdminConfirmDialogue = ({
  show,
  title,
  message,
  onCancel,
  onConfirm,
  showReasonInput = false,
  reasonLabel = "Razlog",
}) => {
  const [reason, setReason] = useState("");

  useEffect(() => {
    // Reset the reason when the dialog is shown/hidden
    if (!show) setReason("");
  }, [show]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md text-center">
        <h2 className="text-xl font-semibold mb-4">{title}</h2>
        <p className="mb-6 text-gray-700">{message}</p>

        {showReasonInput && (
          <div className="mb-6 text-left">
            <label className="block mb-1 text-gray-600">{reasonLabel}</label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Unesi razlog"
            />
          </div>
        )}

        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
          >
            Otkaži
          </button>
          <button
            onClick={() => onConfirm(reason)}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Potvrdi
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminConfirmDialogue;
