import React, { useContext, useState } from 'react'
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThemeContext from '../ThemeContext';
const Dropdown = ({ children }) => {
    const [isOpen, setIsOpen] = useState(true);
    const { theme } = useContext(ThemeContext);
    return (
      <div className="dropdown">
        <MoreVertIcon MouseOver ={() => setIsOpen(!isOpen)}/>
        {isOpen && 
          theme === "light" ? (
            <div style={{backgroundColor: "#FFFFFF"}} className='dropdown-content'>{children}</div>
          ) : (
            <div style={{backgroundColor: "#202020"}} className='dropdown-content'>{children}</div>
          )         
        }
      </div>
    );
  };

  export default Dropdown;
