import React, { useEffect, useState } from "react";

const MyModal = ({ open, onClose, children, header }) => {
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.keyCode === 27) {
        onClose();
      }
    };

    if (open) {
      window.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return (
    open && (
      <div className="modal-container" onClick={handleClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center justify-between space-x-2">
            {header && <h2 className="text-2xl font-bold">{header}</h2>}
            <span className="close-button text-2xl font-bold" onClick={handleClose}>
              ✕
            </span>
          </div>
          <div className="pt-[20px]">{children}</div>
        </div>
      </div>
    )
  );
};

export default MyModal;
