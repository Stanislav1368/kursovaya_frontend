import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addState,
  addTask,
  deleteBoard,
  deleteState,
  deleteTask,
  updateBoard,
  updateTask,
  addUserInBoard,
  createPriority,
  createRole,
  fetchBoardById,
  fetchStates,
  fetchUser,
  fetchUserId,
  fetchUsersByBoard,
  getCurrentRole,
  getPriorities,
  getRoleByBoardId,
  getRoles,
  updateRole,
  updateRoleByBoardId,
} from "../api";

import { useMutation, useQuery, useQueryClient } from "react-query";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import EditIcon from "@mui/icons-material/Edit";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SettingsAccessibilityIcon from "@mui/icons-material/SettingsAccessibility";
import AddIcon from "@mui/icons-material/Add";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import Task from "../Components/Task";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LogoutIcon from "@mui/icons-material/Logout";
import ArchiveIcon from "@mui/icons-material/Archive";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import Avatar from "@mui/material/Avatar";
import ThemeContext from "../ThemeContext";
import LightModeIcon from "@mui/icons-material/LightMode";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MyModal from "../Components/MyModal";
import { ArrowLeft, ArrowLeftOutlined, ArrowLeftSharp, ArrowRight } from "@mui/icons-material";
import Notification from "../Components/Notification";
import Navbar from "../Components/Navbar";
import Column from "../Components/Column";
import BoardHeader from "../Components/BoardHeader";
import Dropdown from "../Components/Dropdown";

const Board = () => {
  const { theme, updateTheme } = useContext(ThemeContext);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [currentStateId, setCurrentStateId] = useState(0);
  const [currentTaskId, setCurrentTaskId] = useState(0);
  const [selectedStateId, setSelectedStateId] = useState();
  const [isRead, setIsRead] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#000000");

  // const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState();
  const handleColorChange = (event) => {
    const newColor = event.target.value;
    setSelectedColor(newColor);
  };

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

  const [openPriorityModal, setOpenPriorityModal] = useState(false);
  const handleOpenPriorityModal = () => {
    setOpenPriorityModal(true);
  };
  const handleClosePriorityModal = () => {
    setOpenPriorityModal(false);
  };

  const [openAddSectionModal, setOpenAddSectionModal] = useState(false);
  const handleOpenAddSectionModal = () => {
    setOpenAddSectionModal(true);
  };
  const handleCloseAddSectionModal = () => {
    setOpenAddSectionModal(false);
  };
  const [openAccessSettingsModal, setOpenAccessSettingsModal] = useState(false);
  const handleOpenAccessSettingsModal = () => {
    setOpenAccessSettingsModal(true);
  };
  const handleCloseAccessSettingsModal = () => {
    setOpenAccessSettingsModal(false);
  };
  const [openRolesModal, setOpenRolesModal] = useState(false);
  const handleOpenRolesModal = () => {
    setOpenRolesModal(true);
  };
  const handleCloseRolesModal = () => {
    setOpenRolesModal(false);
  };
  const [openNotifSuccessState, setOpenNotifSuccessState] = useState(false);
  const handleOpenNotifSuccessState = () => {
    setOpenNotifSuccessState(true);
    setTimeout(() => {
      setOpenNotifSuccessState(false);
    }, 2000);
  };

  const [openNotifSuccessTask, setOpenNotifSuccessTask] = useState(false);
  const handleOpenNotifSuccessTask = () => {
    setOpenNotifSuccessTask(true);
    setTimeout(() => {
      setOpenNotifSuccessTask(false);
    }, 2000);
  };

  const [openNotifSuccessUser, setOpenNotifSuccessUser] = useState(false);
  const handleOpenNotifSuccessUser = () => {
    setOpenNotifSuccessUser(true);
    setTimeout(() => {
      setOpenNotifSuccessUser(false);
    }, 2000);
  };

  const [openNotifErrorUser, setOpenNotifErrorUser] = useState(false);
  const handleOpenNotifErrorUser = () => {
    setOpenNotifErrorUser(true);
    setTimeout(() => {
      setOpenNotifErrorUser(false);
    }, 2000);
  };

  const { boardId } = useParams();
  const queryClient = useQueryClient();
  const { data: userId, isLoading: isUserIdLoading } = useQuery("userId", fetchUserId, {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
  const { data: user, isLoading: isUserLoading } = useQuery("user", fetchUser, {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
  const { data: users, isLoading: isUsersLoading } = useQuery(["usersBoard", boardId], () => fetchUsersByBoard(boardId));
  const { data: board, isLoading: isBoardLoading } = useQuery("board", () => fetchBoardById(userId, boardId), {
    enabled: !!userId,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
  // const { data: roles, isLoading: isRolesLoading } = useQuery("roles", () => getRoles(boardId), {
  //   refetchOnWindowFocus: false,
  //   keepPreviousData: true,
  // });
  const updateBoardMutation = useMutation((newTitle) => updateBoard(userId, boardId, { title: newTitle }), {
    onSuccess: () => {
      queryClient.invalidateQueries("board");
    },
  });
  const { data: priorities, isLoading: isPrioritiesLoading } = useQuery("priorities", () => getPriorities(boardId), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
  const { data: states, isLoading: isStatesLoading } = useQuery("states", () => fetchStates(userId, boardId), {
    enabled: !!userId,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
  const { data: isOwner, isLoading: isRoleLoading } = useQuery("isOwner", () => getRoleByBoardId(userId, boardId), {
    enabled: !!userId,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
  const { data: currentRole, isLoading: isCurrentRoleLoading } = useQuery("currentRole", () => getCurrentRole(userId, boardId), {
    enabled: !!userId,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  const DeleteStateMutation = useMutation((stateId) => deleteState(userId, boardId, stateId), {
    onSuccess: () => queryClient.invalidateQueries(["states"]),
  });
  const UpdateTaskMutation = useMutation((data, newOrder) => updateTask(userId, boardId, currentStateId, currentTaskId, data, newOrder), {
    onSuccess: () => queryClient.invalidateQueries(["states"]),
  });

  const handleAddTask = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.target);
      const fields = {};
      for (const [name, value] of formData.entries()) {
        if (fields[name]) {
          if (!Array.isArray(fields[name])) {
            fields[name] = [fields[name]];
          }
          fields[name].push(value);
        } else {
          fields[name] = value;
        }
      }

      await addTask(fields, userId, boardId, selectedStateId);

      handleCloseTaskModal();
      handleOpenNotifSuccessTask();
      await queryClient.invalidateQueries(["states"]);
    } catch (error) {
      console.error(error);
    }
  };

  if (isUserLoading || isRoleLoading || isUserIdLoading || isStatesLoading || isBoardLoading || isUsersLoading || isCurrentRoleLoading) {
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

  // const handleDropGreenZone = async (e, state, newOrder) => {
  //   e.preventDefault();
  //   e.target.style.border = "none";
  //   console.log(newOrder);
  //   UpdateTask(userId, boardId, currentStateId, currentTaskId, state.id, newOrder);
  //   queryClient.invalidateQueries(["states"]);

  // };
  const handleDrop = async (e, state) => {
    e.preventDefault();
    if (state.id === currentStateId) {
      return;
    }
    e.target.style.border = "none";
    UpdateTaskMutation.mutate(state.id);
    queryClient.invalidateQueries(["states"]);
    console.log(state);
  };
  const handleDragEnd = (e) => {
    e.preventDefault();
    e.target.style.border = "none";
  };
  const dragLeaveHandler = (e) => {
    e.preventDefault();
    e.target.style.border = "none";
  };

  return (
    <div>
      <Navbar userId={userId} boardId={boardId}></Navbar>
      <BoardHeader currentRole={currentRole} board={board} isOwner={isOwner} userId={userId} priorities={priorities} boardId={boardId}></BoardHeader>

      <div className="main flex flex-row h-[calc(100vh-200px)] p-[15px]">
        {states
          .sort((a, b) => a.id - b.id)
          .map((state) => (
            <div className="state flex flex-col w-[350px] mr-4 overflow-y-auto " key={state.id}>
              <div className="state-header flex justify-between items-center p-4 ">
                <div className="items-center flex">
                  <ArrowLeft />
                  <span className="text-2xl font-bold break-words">
                    {state.title}
                  </span>
                </div>

                <div className="flex">
                  <Dropdown>
                    <p>Элемент 1</p>
                    <p>Элемент 2</p>
                    <p>Элемент 3</p>
                  </Dropdown>
                  <AddIcon className="cursor-pointer hover:text-green-300" onClick={() => handleOpenTaskModal(state.id)} />
                  <MyModal open={openTaskModal} onClose={handleCloseTaskModal} header="Новая задача">
                    <form onSubmit={(event) => handleAddTask(event, state.id)} className="flex flex-col items-start">
                      <input required className="" type="text" name="title" placeholder="title" />
                      <input required className="" type="text" name="description" placeholder="description" />
                      <div>
                        <label>Выберите дату и время:</label>
                        <input type="datetime-local" name="deadline" />
                      </div>
                      <div className="flex flex-col">
                        {users.map((user, index) => (
                          <div key={index}>
                            <input type="checkbox" name="userIds" value={user.id} />
                            <label className="ml-[5px]">{user.name}</label>
                          </div>
                        ))}
                      </div>
                      <div className="pb-[15px]">
                        <select name="priorityId" className="block rounded-md p-[8px]">
                          {priorities.map((priority, index) => (
                            <option key={index} value={priority.id}>
                              {priority.name}
                              {/* <div style={{ backgroundColor: priority.color }}></div> */}
                            </option>
                          ))}
                        </select>
                      </div>

                      <button type="submit" className="">
                        Добавить задачу
                      </button>
                    </form>
                  </MyModal>
                  <DeleteForeverIcon className="ml-2 cursor-pointer hover:text-red-500" onClick={() => DeleteStateMutation.mutate(state.id)} />
                  <ArrowRight />
                </div>
              </div>
              <div
                className="column  h-full space-y-[15px]"
                onDragLeave={(e) => dragLeaveHandler(e)}
                onDragOver={(e) => handleDragOver(e)}
                onDrop={(e) => handleDrop(e, state)}>
                {state.tasks
                  .sort((a, b) => a.order - b.order) // Сортировка задач по полю order
                  .map((task, index) => (
                    <div
                      key={task.id}
                      className="task rounded mx-4"
                      draggable={true}
                      onDragOver={(e) => e.stopPropagation()}
                      onDragLeave={(e) => dragLeaveHandler(e)}
                      onDragStart={(e) => handleDragStart(e, state.id, task.id)}
                      onDragEnd={(e) => handleDragEnd(e)}>
                      <Task userId={userId} boardId={boardId} state={state} task={task} currentRole={currentRole}></Task>
                    </div>
                  ))}
              </div>
            </div>
            // <Column userId={userId} users={users} priorities={priorities} boardId={boardId} state={state}></Column>
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
