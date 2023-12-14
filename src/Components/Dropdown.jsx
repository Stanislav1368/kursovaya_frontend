import React, { useContext, useState } from 'react'
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThemeContext from '../ThemeContext';
const Dropdown = ({ children }) => {
    const [isOpen, setIsOpen] = useState(true);
    const { theme } = useContext(ThemeContext);
    return (
      <div className="dropdown">
        <MoreVertIcon onClick={() => setIsOpen(!isOpen)}/>
        {isOpen && 
          theme === "light" ? (
            <div className="border shadow-xl rounded-lg p-2 min-w-max dropdown-content space-x-2 bg-[#ffffff]">{children}</div>
          ) : (
            <div className="border shadow-xl rounded-lg p-2 min-w-max dropdown-content space-x-2 bg-[#202020]">{children}</div>
          )         
        }
      </div>
    );
  };

  export default Dropdown;
