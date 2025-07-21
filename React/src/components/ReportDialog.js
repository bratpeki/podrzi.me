import React, { useState } from "react";

const ReportDialog = ({ show, onClose, onConfirm }) => {
  const [text, setText] = useState("");

  if (!show) return null;

  const handleConfirmClick = () => {
    onConfirm(text);
    setText("");
  };

  const handleClose = () => {
    setText("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">Prijava</h2>
        <p>Unesite razlog za kreiranje Prijave:</p>
        <textarea
          className="w-full p-2 mt-2 border rounded resize-none"
          rows={4} // You can change this to however many rows you'd like
          placeholder="Razlog"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="flex justify-end gap-2 mt-4">
          <button
            onClick={handleClose}
            className="bg-gray-300 hover:bg-gray-400 text-black font-semibold py-2 px-4 rounded"
          >
            Odustani
          </button>
          <button
            onClick={handleConfirmClick}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded"
          >
            Potvrdi
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportDialog;
