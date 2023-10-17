import React, { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { AddBoard, DeleteBoard, fetchBoards, fetchUser, fetchUserId } from "../api";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import UsersBoardList from "./UsersBoardList";
import LogoutIcon from "@mui/icons-material/Logout";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import AddIcon from "@mui/icons-material/Add";
import ThemeContext from "../ThemeContext";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import MyModal from "./MyModal";
import Notification from "./Notification";
const BoardsList = () => {
  const { theme, updateTheme } = useContext(ThemeContext);
  const queryClient = useQueryClient();
  const [openAddBoardModal, setOpenAddBoardModal] = useState(false);
  const handleOpenAddBoardModal = () => {
    setOpenAddBoardModal(true);
  };
  const handleCloseAddBoardModal = () => {
    setOpenAddBoardModal(false);
  };

  const [openNotif, setOpenNotif] = useState(false);
  const handleOpenNotif = () => {
    setOpenNotif(true);
    setTimeout(() => {
      handleCloseNotif();
    }, 2000);
  };
  const handleCloseNotif = () => {
    setOpenNotif(false);
  };
  const { data: user, isLoading: isUserLoading } = useQuery("user", fetchUser);

  const { data: boards, isLoading: isBoardsLoading } = useQuery("boards", () => fetchBoards(user.id), { enabled: !!user });

  const AddBoardMutation = useMutation((data) => AddBoard(data, user.id), {
    onSuccess: () => queryClient.invalidateQueries(["boards"]),
  });

  const addBoard = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.target);
      const fields = Object.fromEntries(formData);
      handleCloseAddBoardModal();
      AddBoardMutation.mutate(fields);
      handleOpenNotif();
    } catch (error) {
      console.error(error);
    }
  };

  if (isUserLoading || isBoardsLoading) {
    return <div></div>;
  }
  const handleButtonClick = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    updateTheme(newTheme);
  };
  return (
    <div>
      <div className="navbar ">
        <div className="flex items-center  space-x-3 ">
          <h1 className="">Имя пользователя: {user.name}</h1>
          <Notification status="success" open={openNotif}>
            Доска успешно создана
          </Notification>
          <MyModal open={openAddBoardModal} onClose={handleCloseAddBoardModal} header="Новая доска">
            <form onSubmit={addBoard} className="flex flex-col items-start">
              <input required type="text" name="title" placeholder="title" />
              <button type="submit">Добавить доску</button>
            </form>
          </MyModal>
        </div>

        <div className="flex items-center">
          <button className="px-[12px] mr-[15px]" onClick={handleOpenAddBoardModal}>
            Добавить доску
          </button>
          {theme === "light" ? (
            <LightModeIcon className="toggleMode border-none mr-[15px] p-0" onClick={handleButtonClick}></LightModeIcon>
          ) : (
            <DarkModeIcon className="toggleMode border-none mr-[15px] p-0" onClick={handleButtonClick}></DarkModeIcon>
          )}
          <LogoutIcon
            className="cursor-pointer"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}></LogoutIcon>
        </div>
      </div>
      <div className="p-[15px] w-screen">
        <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4 ">
          {boards
            .sort((a, b) => a.id - b.id)
            .map((board) => (
              <Link to={`/boards/${board.id}`} key={board.id} className="board hover:border h-[200px]">
                <div className="flex flex-row h-full">
                  <div className="h-full w-[8px] bg-red-700"></div>
                  <div className="ms-2 h-full">
                    <div className=" text-2xl font-bold">{board.title}</div>
                    <UsersBoardList boardId={board.id} />
                  </div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
};

export default BoardsList;
