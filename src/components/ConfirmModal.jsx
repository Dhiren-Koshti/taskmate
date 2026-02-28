import React from "react";

export default function ConfirmModal({ show, onClose, onConfirm, message }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
      <div className="glass w-full max-w-sm p-6">
        <h3 className="text-base font-bold text-heading mb-2">Confirm</h3>
        <p className="text-body text-sm mb-6 leading-relaxed">{message}</p>
        <div className="flex justify-end gap-3">
          <button className="btn-secondary text-sm !px-4 !py-2" onClick={onClose}>Cancel</button>
          <button className="btn-danger text-sm !px-4 !py-2" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}