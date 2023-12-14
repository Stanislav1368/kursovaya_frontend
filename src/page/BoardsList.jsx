import React, { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { AddBoard, deleteBoard, fetchBoards, fetchUser, fetchUserId } from "../api";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import UsersBoardList from "../Components/UsersBoardList";
import LogoutIcon from "@mui/icons-material/Logout";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import AddIcon from "@mui/icons-material/Add";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import ThemeContext from "../ThemeContext";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import MyModal from "../Components/MyModal";
import Notification from "../Components/Notification";
import moment from "moment/moment";
import Navbar from "../Components/Navbar";
import Dropdown from "../Components/Dropdown";
import EditIcon from "@mui/icons-material/Edit";

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
      setOpenNotif(false);
    }, 2000);
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
  const handleEditClick = () => {
    setIsEditing(true);
    setNewTitle(board.title);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    console.log(newTitle);
    updateBoardMutation.mutate(newTitle);
    setIsEditing(false);
  };

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value);
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
      <MyModal open={openAddBoardModal} onClose={handleCloseAddBoardModal} header="Новая доска">
        <form onSubmit={addBoard} className="flex flex-col items-start space-y-3">
          <input required type="text" name="title" placeholder="title" />
          <button type="submit">Добавить доску</button>
        </form>
      </MyModal>
      <Notification status="success" open={openNotif}>
        Доска успешно создана
      </Notification>
      <Navbar></Navbar>
      <div className="flex items-center justify-center mt-5 sm:mt-10 md:mt-20">
        <div className="container  justify-center flex avatar-card ">
          <div className="w-[20%]">
            <img
              src="https://sartur.sgu.ru/wp-content/uploads/2021/09/avatar1-1536x1536.png"
              class="h-36 sm:h-48 md:h-60 w-36 sm:w-48 md:w-60 rounded-full object-cover"
              alt="круглое изображение"
            />
            <div className="flex">
              <h1 className="text-4xl font-bold">{user.name}</h1>
              <EditIcon />
            </div>
          </div>
          <div className="w-[50%] rounded-lg list-boards">
            <div className="p-[15px] header-list-boards flex items-center justify-between rounded-t-lg">
              <div className=" text-3xl">Доски</div>
              <button className="p-[12px] mr-[15px]" onClick={handleOpenAddBoardModal}>
                Новая доска
              </button>
            </div>
            <div className="body-list-boards h-min max-h-[750px] overflow-y-auto">
              <section>
                <div>
                  <ul>
                    {boards.map((board, index) => (
                      <li key={board.id} className="p-[5px]">
                        <Link to={`/boards/${board.id}`} className="hover:text-blue-500 hover:underline h-[200px]">
                          {board.title}
                        </Link>

                        <div className="text-[12px] text-[#504f4f]">Создана {moment.utc(board.createdAt).format("DD.MM.YYYY")}</div>
                        <UsersBoardList boardId={board.id} />
                      </li>
                    ))}
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardsList;
