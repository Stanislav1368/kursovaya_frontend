import React, { useState } from "react";

const MyModal = ({ open, onClose, children, header }) => {
  if (open) {
    const handleKeyDown = (event) => {
      if (event.keyCode === 27) {
        // 27 соответствует клавише "Esc"
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
  }
  return (
    <div onClick={onClose} className={`myModal ${open ? "open" : ""}`}>
      <div className="myModal-content">
        <div className="pb-[20px] pt-[5px] pl-[20px] pr-[5px]">
          <div className="flex justify-between">
            <h1 className=" text-2xl">{header}</h1>
            <div
              className="close-button text- xl bold  w-[40px] h-[40px] flex justify-center items-center "
              onClick={onClose}
            >
              &#10005;
            </div>
          </div>
          <div className="">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default MyModal;
