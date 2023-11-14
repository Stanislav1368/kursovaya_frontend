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
import Task from "./Task";
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

  const [isEditing, setIsEditing] = useState(false);
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
  const { data: roles, isLoading: isRolesLoading } = useQuery("roles", () => getRoles(boardId), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
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
  const DeleteBoardMutation = useMutation((boardId) => deleteBoard(userId, boardId));
  const AddStateMutation = useMutation((data) => addState(data, userId, boardId), { onSuccess: () => queryClient.invalidateQueries(["states"]) });
  const DeleteStateMutation = useMutation((stateId) => deleteState(userId, boardId, stateId), {
    onSuccess: () => queryClient.invalidateQueries(["states"]),
  });
  const UpdateTaskMutation = useMutation((data, newOrder) => updateTask(userId, boardId, currentStateId, currentTaskId, data, newOrder), {
    onSuccess: () => queryClient.invalidateQueries(["states"]),
  });
  // const UpdateUserPrivilegeMutation = useMutation(
  //   (newPrivilege) => {updateRoleByBoardId(userId, boardId, newPrivilege), console.log("data: " + data)},
  //   { onSuccess: () => queryClient.invalidateQueries(["userBoard"]) }
  // );
  const CreateRoleMutation = useMutation((data) => createRole(data, boardId), { onSuccess: () => queryClient.invalidateQueries(["roles"]) });
  const CreatePriorityMutation = useMutation((data) => createPriority(data, boardId), {
    onSuccess: () => queryClient.invalidateQueries(["priorities"]),
  });
  const handleCheckboxChange = async (e, userId, boardId) => {
    e.preventDefault();
    try {
      updateRoleByBoardId(userId, boardId, e.target.checked);
      await queryClient.invalidateQueries(["usersBoard"]);
    } catch (error) {
      console.error(error);
    }
  };

  const createRoleForBoard = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.target);
      const fields = Object.fromEntries(formData);

      // Преобразование значений чекбоксов
      fields.isRead = Boolean(fields.isRead);
      fields.isCreate = Boolean(fields.isCreate);
      fields.isDelete = Boolean(fields.isDelete);
      handleCloseRolesModal();
      CreateRoleMutation.mutate(fields);
    } catch (error) {
      console.error(error);
    }
  };

  const createPriorityForBoard = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.target);
      const fields = Object.fromEntries(formData);

      handleClosePriorityModal();

      CreatePriorityMutation.mutate(fields);
    } catch (error) {
      console.error(error);
    }
  };

  const handleAddState = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.target);
      const fields = Object.fromEntries(formData);
      handleCloseAddSectionModal();
      handleOpenNotifSuccessState();
      AddStateMutation.mutate(fields);
    } catch (error) {
      console.error(error);
    }
  };

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
  const handleAddUserInBoard = async (event, boardId) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.target);
      const userId = formData.get("userId");
      await addUserInBoard(userId, boardId);
      handleCloseAddUserModal();
      await queryClient.invalidateQueries(["usersBoard", boardId]);
      handleOpenNotifSuccessUser();
    } catch (error) {
      console.error(error);
      handleOpenNotifErrorUser();
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
  const handleButtonClick = () => {
    // Изменяем значение темы
    const newTheme = theme === "light" ? "dark" : "light";
    updateTheme(newTheme);
  };
  async function handleRoleChange(userId, roleId) {
    await updateRole(userId, boardId, { roleId });
    queryClient.invalidateQueries(["usersBoard", boardId]); // Обновление кэша данных
  }

  const handleEditClick = () => {
    setIsEditing(true);
    setNewTitle(board.title);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
  };

  const handleSaveClick = () => {
    if (newTitle) {
      console.log(newTitle);
      updateBoardMutation.mutate(newTitle);
      setIsEditing(false);
    }
  };

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value);
  };
  return (
    <div>
      <MyModal open={openAddSectionModal} onClose={handleCloseAddSectionModal} header="Новая секция">
        <form onSubmit={handleAddState} className="flex flex-col items-start">
          <input required className="" type="text" name="title" placeholder="title" />
          <button type="submit" className="">
            Добавить секцию
          </button>
        </form>
      </MyModal>
      <Notification status="success" open={openNotifSuccessState}>
        таблица успешно создана
      </Notification>
      <Notification status="success" open={openNotifSuccessTask}>
        Задача успешно добавлена
      </Notification>
      <Notification status="success" open={openNotifSuccessUser}>
        Новый пользователь успешно добавлен
      </Notification>
      <Notification status="error" open={openNotifErrorUser}>
        Ошибка! Пользователь не найден
      </Notification>
      <Navbar userId={userId} boardId={board.id}></Navbar>
      <div className="board-header  h-[150px] p-[15px] space-y-5">
        <div className="flex items-center">
          <>
            {isEditing ? (
              <div className="space-x-[15px] flex items-center">
                <input className="text-3xl font-bold w-[250px] h-[35px]" type="text" value={newTitle} onChange={handleTitleChange} />
                <button className="p-[5px] h-[35px]" onClick={() => handleSaveClick()}>
                  Save
                </button>
                <button className="p-[5px] h-[35px]" onClick={handleCancelClick}>
                  Cancel
                </button>
              </div>
            ) : (
              <>
                <h1 className="text-4xl font-bold">{board.title}</h1>
                <EditIcon onClick={handleEditClick} />
              </>
            )}
          </>
          <div className="avatar-overlay ms-5 flex flex-row">
            {users
              .sort((a, b) => a.id - b.id)
              .map((user, index) => (
                <Avatar key={index} {...stringAvatar(user.name)} />
              ))}
          </div>
        </div>

        {/* <div>{isOwner ? "Создатель" : currentRole.name}</div> */}

        <div className="flex flex-row items-center space-x-[15px]">
          {isOwner || currentRole.isCreate ? (
            <>
              <button className="p-[10px]" onClick={handleOpenAddSectionModal}>
                <ViewColumnIcon /> Добавить секцию
              </button>
              <button className="p-[10px]" onClick={handleOpenAddUserModal}>
                <PersonAddIcon /> Добавить пользователя
              </button>
              <button className="p-[10px]" onClick={handleOpenPriorityModal}>
                <PriorityHighIcon /> Приоритеты
              </button>
              <button className="p-[10px]">
                <LeaderboardIcon /> Статистика
              </button>
              <button className="p-[10px]">
                <ArchiveIcon /> Архив
              </button>

              <button className="p-[10px]" onClick={handleOpenRolesModal}>
                <SettingsAccessibilityIcon /> Роли
              </button>
            </>
          ) : null}
          <button className="p-[10px]" onClick={handleOpenAccessSettingsModal}>
            <SettingsAccessibilityIcon /> Настройки доступа
          </button>
        </div>
      </div>
      <div>
        <MyModal open={openRolesModal} onClose={handleCloseRolesModal} header="Роли">
          <div className="flex">
            <form onSubmit={(event) => createRoleForBoard(event, boardId)}>
              <table>
                <thead>
                  <tr>
                    <th className=" text-left">Роль</th>
                    <th className=" text-left">Чтение</th>
                    <th className=" text-left">Создание</th>
                    <th className=" text-left">Удаление</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="w-1/4">
                      <input required type="text" name="name" placeholder="Название роли" />
                    </td>
                    <td className="w-1/4 ">
                      <input
                        name="isRead"
                        type="checkbox"
                        onChange={(e) => {
                          // Обработчик события onChange
                          const checked = e.target.checked;
                          // Обновление состояния, отражающего отмечен ли чекбокс
                          setIsRead(checked);
                        }}
                      />
                    </td>
                    <td className="w-1/4 ">
                      <input
                        name="isCreate"
                        type="checkbox"
                        onChange={(e) => {
                          // Обработчик события onChange
                          const checked = e.target.checked;
                          // Обновление состояния, отражающего отмечен ли чекбокс
                          setIsCreate(checked);
                        }}
                      />
                    </td>
                    <td className="w-1/4 ">
                      <input
                        name="isDelete"
                        type="checkbox"
                        onChange={(e) => {
                          // Обработчик события onChange
                          const checked = e.target.checked;
                          // Обновление состояния, отражающего отмечен ли чекбокс
                          setIsDelete(checked);
                        }}
                      />
                    </td>
                  </tr>
                </tbody>
              </table>

              <button type="submit" className="p-[10px]">
                <SettingsAccessibilityIcon /> Создать роль
              </button>
            </form>
          </div>
          <div className="">
            <table>
              <thead>
                <tr>
                  <th className=" text-left">Роль</th>
                  <th className=" text-left">Чтение</th>
                  <th className=" text-left">Создание</th>
                  <th className=" text-left">Удаление</th>
                </tr>
              </thead>
              <tbody>
                {roles.map((role, index) => (
                  <tr key={index}>
                    <td className="w-1/4">{role.name}</td>
                    <td className="w-1/4 ">
                      <input disabled type="checkbox" checked={role.isRead}></input>
                    </td>
                    <td className="w-1/4 ">
                      <input disabled type="checkbox" checked={role.isCreate}></input>
                    </td>
                    <td className="w-1/4 ">
                      <input disabled type="checkbox" checked={role.isDelete}></input>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </MyModal>
        <MyModal open={openAccessSettingsModal} onClose={handleCloseAccessSettingsModal} header="Права доступа">
          <table>
            <thead>
              <tr>
                <th className="text-left">Имя пользователя</th>
                <th className="text-left">Роль</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr key={index}>
                  <td className="w-1/4">
                    {user.name}
                    {user.isOwner && <span className="font-bold underline">(Вы)</span>}
                    {user.isOwner && <span className="ml-2">Администратор</span>}
                  </td>
                  <td className="w-1/4">
                    <div className="py-2">
                      {user.isOwner ? (
                        <span className="block rounded-md p-[8px]">Администратор</span>
                      ) : (
                        <select className="block rounded-md p-[8px]" value={user.roleId} onChange={(e) => handleRoleChange(user.id, e.target.value)}>
                          {roles.map((role, index) => (
                            <option key={index} value={role.id}>
                              {role.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </MyModal>
        <MyModal open={openAddUserModal} onClose={handleCloseAddUserModal} header="Добавить пользователя к доске">
          <form onSubmit={(event) => handleAddUserInBoard(event, boardId)} className="">
            <input required className="w-[50%]" type="text" name="userId" placeholder="userId" />
            <button type="submit" className="w-[50%]">
              Добавить пользователя
            </button>
          </form>
        </MyModal>
        <MyModal open={openPriorityModal} onClose={handleClosePriorityModal} header="Создать новый приоритет">
          <div className="space-x-[15px]">
            {priorities.map((priority, index) => (
              // <div
              //   key={priority?.id}
              //   style={{ borderColor: priority?.color, color: priority?.color, fontSize: "12px" }}
              //   className="label h-[20px] w-min rounded-[999px] px-[8px] border-[1px] items-center mb-[5px]">
              //   {priority?.name}
              // </div>
              <div
                key={priority?.id}
                style={{ borderColor: priority?.color, backgroundColor: priority?.color, fontSize: "12px" }}
                className="  label h-[35px] rounded-[5px] px-[8px] border-[1px] items-center mb-[5px] font-bold text-3xl text-black inline-block">
                {priority?.name}
              </div>
            ))}
          </div>

          <form onSubmit={(event) => createPriorityForBoard(event, boardId)} className="">
            <input required className="w-[50%]" type="text" name="name" placeholder="Наименование" />
            <input type="number" id="tentacles" name="index" min="1" max="99" />
            <div className="flex flex-row">
              <input className="mb-[15px]" type="color" name="color" value={selectedColor} onChange={handleColorChange} />
              <label>Цвет</label>
            </div>
            <button type="submit" className="w-[50%]">
              Создать приоритет
            </button>
          </form>
        </MyModal>
      </div>
      <div className="main flex flex-row h-[calc(100vh-200px)] p-[15px]">
        {states
          .sort((a, b) => a.id - b.id)
          .map((state) => (
            <div className="state flex flex-col w-[350px] mr-4 overflow-y-auto " key={state.id}>
              <div className="state-header flex justify-between items-center p-4 ">
                <div className="items-center flex">
                  <ArrowLeft />
                  <span className="text-2xl font-bold break-words">{state.title}</span>
                </div>

                <div className="flex">
                  {/* ДОДЕЛАТЬ ДОДЕЛАТЬ ДОДЕЛАТЬ ДОДЕЛАТЬ ДОДЕЛАТЬ ДОДЕЛАТЬ ДОДЕЛАТЬ ДОДЕЛАТЬ ДОДЕЛАТЬ ДОДЕЛАТЬ ДОДЕЛАТЬ  */}
                  <MoreVertIcon></MoreVertIcon>
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
