import { useState } from "react";
import { IconButton, Tooltip } from "@mui/material";
import React from "react";

const Button = ({ icon, text }) => {
    const [isHovered, setIsHovered] = useState(false);
  
    return (
      <div className="button-container"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <button className="p-[10px]">
          {icon}
          {isHovered && <span>{text}</span>}
        </button>
      </div>
    );
  };
  
  export default Button;
