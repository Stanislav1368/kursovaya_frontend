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
    <div className={`myModal ${open ? "open" : ""}`}>
      <div className="myModal-content">
        <div className="pb-[20px] pt-[5px] pl-[20px] pr-[0px]">
          <div className="flex justify-between">
            <div className=" text-2xl">{header}</div>
            <div
              className="close-button text-xl bold  w-[50px] h-full flex justify-center items-center "
              onClick={onClose}
            >
              &#10005;
            </div>
          </div>
          <div className="mt-[15px]">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default MyModal;
