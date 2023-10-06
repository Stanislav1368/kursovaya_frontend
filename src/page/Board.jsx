import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import {
  AddState,
  AddTask,
  AddUserInBoard,
  DeleteBoard,
  DeleteState,
  DeleteTask,
  UpdateTask,
  fetchBoardById,
  fetchStates,
  fetchUser,
  fetchUserId,
  fetchUsersByBoard,
  getRoleByBoardId,
} from "../api";
import { useMutation, useQuery, useQueryClient } from "react-query";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import Task from "./Task";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import Avatar from "@mui/material/Avatar";
import ThemeContext from "../ThemeContext";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const Board = () => {
  const { theme, updateTheme } = useContext(ThemeContext);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [currentStateId, setCurrentStateId] = useState();
  const [currentTaskId, setCurrentTaskId] = useState();
  const [selectedStateId, setSelectedStateId] = useState();
  const handleOpenTaskModal = (stateId) => {
    setOpenTaskModal(true);
    setSelectedStateId(stateId);
  };
  const handleCloseTaskModal = () => {
    setOpenTaskModal(false);
  };
  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const handleOpenAddUserModal = () => {
    setOpenAddUserModal(true);
  };
  const handleCloseAddUserModal = () => {
    setOpenAddUserModal(false);
  };
  const [openAddSectionModal, setOpenAddSectionModal] = useState(false);
  const handleOpenAddSectionModal = () => {
    setOpenAddSectionModal(true);
  };
  const handleCloseAddSectionModal = () => {
    setOpenAddSectionModal(false);
  };
  const { boardId } = useParams();
  const queryClient = useQueryClient();
  const { data: userId, isLoading: isUserIdLoading } = useQuery(
    "userId",
    fetchUserId,
    {
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
  const { data: user, isLoading: isUserLoading } = useQuery("user", fetchUser, {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
  const { data: users, isLoading: isUsersLoading } = useQuery(
    ["usersBoard", boardId],
    () => fetchUsersByBoard(boardId)
  );
  const { data: board, isLoading: isBoardLoading } = useQuery(
    "board",
    () => fetchBoardById(userId, boardId),
    {
      enabled: !!userId,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );

  const { data: states, isLoading: isStatesLoading } = useQuery(
    "states",
    () => fetchStates(userId, boardId),
    {
      enabled: !!userId,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
  const { data: isOwner, isLoading: isRoleLoading } = useQuery(
    "isOwner",
    () => getRoleByBoardId(userId, boardId),
    {
      enabled: !!userId,
      refetchOnWindowFocus: false,
      keepPreviousData: true,
    }
  );
  const DeleteBoardMutation = useMutation((boardId) =>
    DeleteBoard(userId, boardId)
  );
  const AddStateMutation = useMutation(
    (data) => AddState(data, userId, boardId),
    { onSuccess: () => queryClient.invalidateQueries(["states"]) }
  );
  const DeleteStateMutation = useMutation(
    (stateId) => DeleteState(userId, boardId, stateId),
    { onSuccess: () => queryClient.invalidateQueries(["states"]) }
  );
  const UpdateTaskMutation = useMutation(
    (data) => UpdateTask(userId, boardId, currentStateId, currentTaskId, data),
    { onSuccess: () => queryClient.invalidateQueries(["states"]) }
  );
  const addState = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.target);
      const fields = Object.fromEntries(formData);
      handleCloseAddSectionModal();
      AddStateMutation.mutate(fields);
    } catch (error) {
      console.error(error);
    }
  };

  const addTask = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.target);
      const fields = Object.fromEntries(formData);
      console.log(fields);
      await AddTask(fields, userId, boardId, selectedStateId);
      handleCloseTaskModal();
      await queryClient.invalidateQueries(["states"]);
    } catch (error) {
      console.error(error);
    }
  };
  const addUserInBoard = async (event, boardId) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.target);
      const userId = formData.get("userId");
      console.log(userId);
      await AddUserInBoard(userId, boardId);
      handleCloseAddUserModal();
      await queryClient.invalidateQueries(["usersBoard", boardId]);
    } catch (error) {
      console.error(error);
    }
  };
  if (
    isUserLoading ||
    isRoleLoading ||
    isUserIdLoading ||
    isStatesLoading ||
    isBoardLoading ||
    isUsersLoading
  ) {
    return <div></div>;
  }
  const handleDragStart = (e, stateId, taskId) => {
    setCurrentStateId(stateId);
    setCurrentTaskId(taskId);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    // e.target.style.border = "2px dashed";
  };

  const handleDrop = async (e, state) => {
    e.preventDefault();
    e.target.style.border = "none";
    UpdateTaskMutation.mutate(state.id);
  };
  const handleDragEnd = (e) => {
    e.preventDefault();
    e.target.style.border = "none";
  };
  const dragLeaveHandler = (e) => {
    e.preventDefault();
    e.target.style.border = "none";
  };
  const handleButtonClick = () => {
    // Изменяем значение темы
    const newTheme = theme === "light" ? "dark" : "light";
    updateTheme(newTheme);
  };
  return (
    <div>
      <div className="navbar h-[50px] ">
        <div className="flex items-center">
          <ArrowBackIcon
            className="cursor-pointer hover:border-b-[2px]"
            onClick={() => {
              window.location.href = "/boards";
            }}
          ></ArrowBackIcon>
        </div>
        <div className="flex items-center">
          {theme === "light" ? (
            <LightModeIcon
              className="toggleMode border-none mr-[15px] p-0"
              onClick={handleButtonClick}
            ></LightModeIcon>
          ) : (
            <DarkModeIcon
              className="toggleMode border-none mr-[15px] p-0"
              onClick={handleButtonClick}
            ></DarkModeIcon>
          )}

          {isOwner ? (
            <DeleteForeverIcon
              className=" mr-[15px] cursor-pointer hover:text-red-500 "
              onClick={() => {
                DeleteBoardMutation.mutate(board.id);
                window.location.href = "/boards";
              }}
            />
          ) : null}

          <LogoutIcon
            className="p-0 cursor-pointer"
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
          ></LogoutIcon>
        </div>
      </div>

      <div className="board-header  h-[150px] p-[15px]">
        <h1 className=" text-5xl font-bold">
          {board.title}#{board.id}
        </h1>
        <div> {isOwner ? "Создатель" : "Обычный исполнитель"}</div>
        <div className="panel flex flex-row items-center">
          {isOwner ? (
            <>
              <button onClick={handleOpenAddSectionModal}>
                Добавить секцию
              </button>
              <button onClick={handleOpenAddUserModal}>
                Добавить пользователя
              </button>
            </>
          ) : null}

          <div className="avatar-overlay flex flex-row">
            {users
              .sort((a, b) => a.id - b.id)
              .map((user, index) => (
                <Avatar key={index} {...stringAvatar(user.name)} />
              ))}
          </div>

          <Modal
            open={openAddSectionModal}
            onClose={handleCloseAddSectionModal}
          >
            <Box className="myModal">
              <h1>Новая секция</h1>
              <form onSubmit={addState} className="flex flex-col items-start">
                <input
                  className=""
                  type="text"
                  name="title"
                  placeholder="title"
                />
                <button type="submit" className="">
                  Добавить секцию
                </button>
              </form>
            </Box>
          </Modal>
        </div>
      </div>
      <div>
        <Modal open={openAddUserModal} onClose={handleCloseAddUserModal}>
          <Box className="myModal">
            <h1>Добавить пользователя к доске</h1>
            <form
              onSubmit={(event) => addUserInBoard(event, boardId)}
              className="flex flex-col items-start"
            >
              <input
                required
                className="focus:outline-none bg-gray border-bw-60"
                type="text"
                name="userId"
                placeholder="userId"
              />
              <button type="submit" className="">
                Добавить пользователя
              </button>
            </form>
          </Box>
        </Modal>
      </div>
      <div className="flex flex-row h-[calc(100vh-200px)] p-[15px]">
        {states
          .sort((a, b) => a.id - b.id)
          .map((state) => (
            <div
              className="state flex flex-col w-64 mr-4 h-full "
              key={state.id}
            >
              <div className="state-header flex justify-between items-center p-4">
                <span className="text-lg font-bold">{state.title}</span>

                <div className="flex">
                  {/* ДОДЕЛАТЬ ДОДЕЛАТЬ ДОДЕЛАТЬ ДОДЕЛАТЬ ДОДЕЛАТЬ ДОДЕЛАТЬ ДОДЕЛАТЬ ДОДЕЛАТЬ ДОДЕЛАТЬ ДОДЕЛАТЬ ДОДЕЛАТЬ  */}
                  <MoreVertIcon></MoreVertIcon>
                  <AddIcon
                    className="cursor-pointer hover:text-green-300"
                    onClick={() => handleOpenTaskModal(state.id)}
                  />

                  <Modal open={openTaskModal} onClose={handleCloseTaskModal}>
                    <Box className="myModal">
                      <h1>Новая задача</h1>
                      <form
                        onSubmit={(event) => addTask(event, state.id)}
                        className="flex flex-col items-start"
                      >
                        <input
                          required
                          className="focus:outline-none bg-gray border-b   w-60"
                          type="text"
                          name="title"
                          placeholder="title"
                        />
                        <input
                          required
                          className="focus:outline-none bg-gray border-b  w-60"
                          type="text"
                          name="description"
                          placeholder="description"
                        />
                        <button type="submit" className="">
                          Добавить задачу
                        </button>
                      </form>
                    </Box>
                  </Modal>

                  <DeleteForeverIcon
                    className="ml-2 cursor-pointer hover:text-red-500"
                    onClick={() => DeleteStateMutation.mutate(state.id)}
                  />
                </div>
              </div>
              <div
                className="column h-full"
                onDragLeave={(e) => dragLeaveHandler(e)}
                onDragOver={(e) => handleDragOver(e)}
                onDrop={(e) => handleDrop(e, state)}
              >
                {state.tasks
                  // .sort((a, b) => a.id - b.id)
                  .map((task, index) => (
                    <div
                      className="task rounded m-4"
                      key={task.id}
                      draggable={true}
                      onDragOver={(e) => e.stopPropagation()}
                      onDragLeave={(e) => dragLeaveHandler(e)}
                      onDragStart={(e) => handleDragStart(e, state.id, task.id)}
                      onDragEnd={(e) => handleDragEnd(e)}
                    >
                      <Task
                        userId={userId}
                        boardId={boardId}
                        state={state}
                        task={task}
                        index={index}
                      ></Task>
                    </div>
                  ))}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Board;

function stringToColor(string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name[0][0] + name[1][0]}`,
  };
}
