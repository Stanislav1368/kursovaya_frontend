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
  createRole,
  fetchBoardById,
  fetchStates,
  fetchUser,
  fetchUserId,
  fetchUsersByBoard,
  getCurrentRole,
  getRoleByBoardId,
  getRoles,
  updateRole,
  updateRoleByBoardId,
} from "../api";
import { useMutation, useQuery, useQueryClient } from "react-query";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import SettingsAccessibilityIcon from "@mui/icons-material/SettingsAccessibility";
import AddIcon from "@mui/icons-material/Add";
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
import MyModal from "./MyModal";
import { ArrowLeft, ArrowLeftOutlined, ArrowLeftSharp, ArrowRight } from "@mui/icons-material";

const Board = () => {
  const { theme, updateTheme } = useContext(ThemeContext);
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [currentStateId, setCurrentStateId] = useState();
  const [currentTaskId, setCurrentTaskId] = useState();
  const [selectedStateId, setSelectedStateId] = useState();
  const [isRead, setIsRead] = useState(false);
  const [isCreate, setIsCreate] = useState(false);
  const [isDelete, setIsDelete] = useState(false);
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
  const DeleteBoardMutation = useMutation((boardId) => DeleteBoard(userId, boardId));
  const AddStateMutation = useMutation((data) => AddState(data, userId, boardId), { onSuccess: () => queryClient.invalidateQueries(["states"]) });
  const DeleteStateMutation = useMutation((stateId) => DeleteState(userId, boardId, stateId), {
    onSuccess: () => queryClient.invalidateQueries(["states"]),
  });
  const UpdateTaskMutation = useMutation((data) => UpdateTask(userId, boardId, currentStateId, currentTaskId, data), {
    onSuccess: () => queryClient.invalidateQueries(["states"]),
  });
  // const UpdateUserPrivilegeMutation = useMutation(
  //   (newPrivilege) => {updateRoleByBoardId(userId, boardId, newPrivilege), console.log("data: " + data)},
  //   { onSuccess: () => queryClient.invalidateQueries(["userBoard"]) }
  // );
  const CreateRoleMutation = useMutation((data) => createRole(data, boardId), { onSuccess: () => queryClient.invalidateQueries(["roles"]) });

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

      await AddTask(fields, userId, boardId, selectedStateId);
      console.log(fields);
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
      await AddUserInBoard(userId, boardId);
      handleCloseAddUserModal();
      await queryClient.invalidateQueries(["usersBoard", boardId]);
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
  async function handleRoleChange(userId, roleId) {
    await updateRole(userId, boardId, { roleId });
    queryClient.invalidateQueries(["usersBoard", boardId]); // Обновление кэша данных
  }
  return (
    <div>
      <MyModal open={openAddSectionModal} onClose={handleCloseAddSectionModal} header="Новая секция">
        <form onSubmit={addState} className="flex flex-col items-start">
          <input className="" type="text" name="title" placeholder="title" />
          <button type="submit" className="">
            Добавить секцию
          </button>
        </form>
      </MyModal>
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
            }}></LogoutIcon>
        </div>
      </div>

      <div className="board-header  h-[150px] p-[15px]">
        <div className="flex items-center">
          <h1 className=" text-5xl font-bold">
            {board.title}#{board.id}
          </h1>
          <div className="avatar-overlay flex flex-row">
            {users
              .sort((a, b) => a.id - b.id)
              .map((user, index) => (
                <Avatar key={index} {...stringAvatar(user.name)} />
              ))}
          </div>
        </div>

        <div>{isOwner ? "Создатель" : currentRole.name}</div>

        <div className="flex flex-row items-center space-x-[15px]">
          {isOwner || currentRole.isCreate ? (
            <>
              <button className="p-[10px]" onClick={handleOpenAddSectionModal}>
                <ViewColumnIcon /> Добавить секцию
              </button>
              <button className="p-[10px]" onClick={handleOpenAddUserModal}>
                <PersonAddIcon /> Добавить пользователя
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
          <select
            id="country"
            className="block rounded-md p-[8px]"
            value={user.roleId}
            onChange={(e) => handleRoleChange(user.id, e.target.value)}
          >
            {roles.map((role, index) => (
              <option key={index} value={role.id}>{role.name}</option>
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
          <form onSubmit={(event) => addUserInBoard(event, boardId)} className="">
            <input required className="w-[50%]" type="text" name="userId" placeholder="userId" />
            <button type="submit" className="w-[50%]">
              Добавить пользователя
            </button>
          </form>
        </MyModal>
      </div>
      <div className="flex flex-row h-[calc(100vh-200px)] p-[15px]">
        {states
          .sort((a, b) => a.id - b.id)
          .map((state) => (
            <div className="state flex flex-col w-[350px] mr-4 h-full " key={state.id}>
              <div className="state-header flex justify-between items-center p-4">
                <div className="items-center flex">
                  <ArrowLeft />
                  <span className="text-lg font-bold break-words">{state.title}</span>
                </div>

                <div className="flex">
                  {/* ДОДЕЛАТЬ ДОДЕЛАТЬ ДОДЕЛАТЬ ДОДЕЛАТЬ ДОДЕЛАТЬ ДОДЕЛАТЬ ДОДЕЛАТЬ ДОДЕЛАТЬ ДОДЕЛАТЬ ДОДЕЛАТЬ ДОДЕЛАТЬ  */}
                  <MoreVertIcon></MoreVertIcon>
                  <AddIcon className="cursor-pointer hover:text-green-300" onClick={() => handleOpenTaskModal(state.id)} />
                  <MyModal open={openTaskModal} onClose={handleCloseTaskModal} header="Новая задача">
                    <form onSubmit={(event) => addTask(event, state.id)} className="flex flex-col items-start">
                      <input required className="" type="text" name="title" placeholder="title" />
                      <input required className="" type="text" name="description" placeholder="description" />

                      <div>
                        {users.map((user, index) => (
                          <label key={index} className="">
                            <input type="checkbox" name="userIds" value={user.id} />
                            {user.name}
                          </label>
                        ))}
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
                className="column h-full"
                onDragLeave={(e) => dragLeaveHandler(e)}
                onDragOver={(e) => handleDragOver(e)}
                onDrop={(e) => handleDrop(e, state)}>
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
                      onDragEnd={(e) => handleDragEnd(e)}>
                      {/* {console.log(task)}  */}
                      <Task userId={userId} boardId={boardId} state={state} task={task} index={index}></Task>
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
