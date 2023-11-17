import React, { useState } from 'react'
import MoreVertIcon from "@mui/icons-material/MoreVert";
const Dropdown = ({ children }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    return (
      <div className="dropdown">
        <MoreVertIcon onClick={() => setIsOpen(!isOpen)}/>
        {isOpen && <div className="dropdown-content">{children}</div>}
      </div>
    );
  };
  
  export default Dropdown;
