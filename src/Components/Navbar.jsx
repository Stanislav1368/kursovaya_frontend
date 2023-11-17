import React, { useContext } from "react";
import { deleteBoard, getCurrentRole, getRoleByBoardId } from "../api";
import { useMutation, useQuery } from "react-query";
import ThemeContext from "../ThemeContext";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
const Navbar = ({ boardId, userId }) => {
  const { data: isOwner, isLoading: isRoleLoading } = useQuery("isOwner", () => (boardId ? getRoleByBoardId(userId, boardId) : undefined), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
    enabled: !!boardId, // Включаем запрос только если boardId передан
  });

  const { data: currentRole, isLoading: isCurrentRoleLoading } = useQuery(
    "currentRole",
    () => (boardId ? getCurrentRole(userId, boardId) : undefined),
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
      enabled: !!boardId, // Включаем запрос только если boardId передан
    }
  );

  const handleButtonClick = () => {
    // Изменяем значение темы
    const newTheme = theme === "light" ? "dark" : "light";
    updateTheme(newTheme);
  };
  const { theme, updateTheme } = useContext(ThemeContext);
  return (
    <div className="navbar h-[50px] ">
      {boardId ? (
        <div className="flex items-center">
          <ArrowBackIcon
            className="cursor-pointer hover:border-b-[2px]"
            onClick={() => {
              window.location.href = "/boards";
            }}></ArrowBackIcon>
        </div>
      ) : (
        <div />
      )}

      <div className="flex items-center">
        {theme === "light" ? (
          <LightModeIcon className="toggleMode border-none mr-[15px] p-0" onClick={handleButtonClick}></LightModeIcon>
        ) : (
          <DarkModeIcon className="toggleMode border-none mr-[15px] p-0" onClick={handleButtonClick}></DarkModeIcon>
        )}

        
        <LogoutIcon
          className="p-0 cursor-pointer"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}></LogoutIcon>
        {/* {!boardId ? (
          
        ) : null} */}
      </div>
    </div>
  );
};

export default Navbar;
