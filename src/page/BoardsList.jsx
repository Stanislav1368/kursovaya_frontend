import React, { useContext, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Link } from "react-router-dom";
import { AddBoard, deleteBoard, fetchBoards, fetchUser, fetchUserId } from "../api";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import UsersBoardList from "./UsersBoardList";
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
        <form onSubmit={addBoard} className="flex flex-col items-start">
          <input required type="text" name="title" placeholder="title" />
          <button type="submit">Добавить доску</button>
        </form>
      </MyModal>
      <Notification status="success" open={openNotif}>
        Доска успешно создана
      </Notification>
      <div className="navbar ">
        <div className="flex items-center  space-x-3 "></div>

        <div className="flex items-center">
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
      <div className="  items-center justify-center flex mt-[15px]">
        <div className="container  justify-center flex avatar-card ">
          <div className="w-[20%] ">
            <img
              src="https://sun9-26.userapi.com/impg/3xLHrlF1PCbxrswiSugRewpAo6G4DQ6ah6_KOw/8kHfAXJhedE.jpg?size=481x645&quality=96&sign=2b1ffbedbe5606c49480bc18ab9529d8&type=album"
              class="h-[260px] w-[260px] rounded-full object-cover"
              alt="круглое изображение"
            />
            <span className=" text-2xl overflow-hidden" itemprop="name">
              {user.name}
            </span>
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
                    {boards
                      .sort((a, b) => a.id - b.id)
                      .map((board) => (
                        <li key={board.id} className="p-[5px]">
                          <Link to={`/boards/${board.id}`} key={board.id} className="hover:text-blue-500 hover:underline h-[200px]">
                            {board.title}
                          </Link>
                          <MoreVertIcon></MoreVertIcon>
                          <div className=" text-[12px] text-[#504f4f]">Создана {moment.utc(board.createdAt).format("MM/DD/YYYY")}</div>
                          <UsersBoardList boardId={board.id} />
                        </li>
                      ))}
                  </ul>
                </div>
              </section>
              {/* {boards
                .sort((a, b) => a.id - b.id)
                .map((board) => (
                  <div key={board.id} className="p-[15px] board">
                    <Link to={`/boards/${board.id}`} key={board.id} className="hover:text-blue-500 hover:underline h-[200px]">
                      {board.title}
                    </Link>
                    <div className=" text-[12px] text-[#504f4f]">обновлено{moment.utc(board.updatedAt).format("MM/DD/YYYY")}</div>
                    <UsersBoardList boardId={board.id} />
                  </div>
                  <Link to={`/boards/${board.id}`} key={board.id} className="board hover:border h-[200px]">
                    <div className="flex flex-row h-full">
                      <div className="h-full w-[8px] bg-red-700"></div>
                      <div className="ms-2 h-full">
                        <div className=" text-2xl font-bold">{board.title}</div>
                        <UsersBoardList boardId={board.id} />
                      </div>
                    </div>
                  </Link>
                ))} */}
            </div>
            {/* <div className="grid md:grid-cols-4 sm:grid-cols-2 gap-4 ">
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
        </div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BoardsList;
