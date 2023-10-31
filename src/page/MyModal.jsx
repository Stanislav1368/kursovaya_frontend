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
        <div className="pb-[20px] pt-[5px] pl-[15px] pr-[ 0px] flex justify-between">
          <div className="flex flex-row items-center justify-between w-full">
            <div className=" text-2xl uppercase">{header}</div>
            <div className="close-button text-2xl bold  w-[50px] h-full flex justify-center items-center " onClick={onClose}>
              &#10005;
            </div>
          </div>
        </div>
        <div className="pl-[15px]">{children}</div>
      </div>
    </div>
  );
};

export default MyModal;
