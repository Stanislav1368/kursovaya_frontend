import React, { useContext } from "react";
import { deleteBoard } from "../api";
import { useMutation, useQuery } from "react-query";
import ThemeContext from "../ThemeContext";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
const Navbar = ({ boardId, userId }) => {
  const { data: isOwner, isLoading: isRoleLoading } = useQuery("isOwner", () => getRoleByBoardId(userId, boardId), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
  const { data: currentRole, isLoading: isCurrentRoleLoading } = useQuery("currentRole", () => getCurrentRole(userId, boardId), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
  const DeleteBoardMutation = useMutation((boardId) => deleteBoard(userId, boardId));
  const handleButtonClick = () => {
    // Изменяем значение темы
    const newTheme = theme === "light" ? "dark" : "light";
    updateTheme(newTheme);
  };
  const { theme, updateTheme } = useContext(ThemeContext);
  return (
    <div className="navbar h-[50px] ">
      <div className="flex items-center">
        <ArrowBackIcon
          className="cursor-pointer hover:border-b-[2px]"
          onClick={() => {
            window.location.href = "/boards";
          }}></ArrowBackIcon>
      </div>
      <div className="flex items-center">
        {theme === "light" ? (
          <LightModeIcon className="toggleMode border-none mr-[15px] p-0" onClick={handleButtonClick}></LightModeIcon>
        ) : (
          <DarkModeIcon className="toggleMode border-none mr-[15px] p-0" onClick={handleButtonClick}></DarkModeIcon>
        )}

        {isOwner || currentRole.isDelete ? (
          <DeleteForeverIcon
            className=" mr-[15px] cursor-pointer hover:text-red-500 "
            onClick={() => {
              DeleteBoardMutation.mutate(boardId);
              window.location.href = "/boards";
            }}
          />
        ) : null}

        <LogoutIcon
          className="p-0 cursor-pointer"
          onClick={() => {
            localStorage.removeItem("token");
            window.location.href = "/login";
          }}></LogoutIcon>
      </div>
    </div>
  );
};

export default Navbar;
