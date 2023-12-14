import React, { useContext } from "react";
import ThemeContext from "../ThemeContext";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";

const Navbar = ({ boardId, userId }) => {
  const { theme, updateTheme } = useContext(ThemeContext);

  const handleButtonClick = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    updateTheme(newTheme);
  };

  const handleBackClick = () => {
    window.location.href = "/boards";
  };

  const handleLogoutClick = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="navbar h-[50px]">
      {boardId ? (
        <>
        <div className="flex items-center">
          <ArrowBackIcon className="cursor-pointer hover:border-b-[2px]" onClick={handleBackClick} />
        </div>
        <div className="flex items-center">
        {theme === "light" ? (
          <LightModeIcon className="toggleMode border-none mr-[15px] p-0" onClick={handleButtonClick} />
        ) : (
          <DarkModeIcon className="toggleMode border-none mr-[15px] p-0" onClick={handleButtonClick} />
        )}
        <LogoutIcon className="p-0 cursor-pointer" onClick={handleLogoutClick} />
      </div>
      </>
      ) : (
        <div className="w-full flex p-0 m-0 justify-end">
        {theme === "light" ? (
          <LightModeIcon className="toggleMode border-none mr-[15px] p-0" onClick={handleButtonClick} />
        ) : (
          <DarkModeIcon className="toggleMode border-none mr-[15px] p-0" onClick={handleButtonClick} />
        )}
        <LogoutIcon className="p-0 cursor-pointer" onClick={handleLogoutClick} />
        </div>
      )}
      
    </div>
  );
};

export default Navbar;