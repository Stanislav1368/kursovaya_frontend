import React, { useEffect, useState } from "react";
import "./MyModal.css";
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';

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
      <div className="modal-container">
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <div style={{display: "flex", alignItems: "center", justifyContent: "space-between"}}>
            {header && <h3 className="text-2xl font-bold">{header}</h3>}

              <CloseRoundedIcon  style={{cursor: "pointer", marginLeft: "20px", color: "red"}} onClick={handleClose}/>

          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    )
  );
};

export default MyModal;
