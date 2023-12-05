import React, { useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import Avatar from "@mui/material/Avatar";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import ViewColumnIcon from "@mui/icons-material/ViewColumn";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import PriorityHighIcon from "@mui/icons-material/PriorityHigh";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import ArchiveIcon from "@mui/icons-material/Archive";
import SettingsAccessibilityIcon from "@mui/icons-material/SettingsAccessibility";
import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  addState,
  addUserInBoard,
  createPriority,
  createRole,
  deleteBoard,
  fetchUser,
  fetchUsersByBoard,
  getRoles,
  updateBoard,
  updateRole,
} from "../api";
import MyModal from "./MyModal";
import Notification from "./Notification";
import Button from "./Button";
import Dropdown from "./Dropdown";

const BoardHeader = ({ board, isOwner, userId, priorities, currentRole, boardId }) => {
  const { data: roles, isLoading: isRolesLoading } = useQuery("roles", () => getRoles(board.id), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
  const privileges = [
    "редактироватьИнформациюДоски",
    "добавлятьСтолбцы",
    "добавлятьПользователей",
    "добавлятьПриоритеты",
    "создаватьРоли(не имеет смысла)",
    "доступКСтатистике",
    "создаватьОтчеты",
    "доступКАрхиву",
  ];
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState();
  const queryClient = useQueryClient();

  const [selectedColor, setSelectedColor] = useState("#000000");

  const handleColorChange = (event) => {
    const newColor = event.target.value;
    setSelectedColor(newColor);
  };
  const [openAddSectionModal, setOpenAddSectionModal] = useState(false);
  const handleOpenAddSectionModal = () => {
    setOpenAddSectionModal(true);
  };
  const handleCloseAddSectionModal = () => {
    setOpenAddSectionModal(false);
  };
  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const handleOpenAddUserModal = () => {
    setOpenAddUserModal(true);
  };
  const handleCloseAddUserModal = () => {
    setOpenAddUserModal(false);
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
  const [openPriorityModal, setOpenPriorityModal] = useState(false);
  const handleOpenPriorityModal = () => {
    setOpenPriorityModal(true);
  };
  const handleClosePriorityModal = () => {
    setOpenPriorityModal(false);
  };
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
  const updateBoardMutation = useMutation((newTitle) => updateBoard(userId, board.id, { title: newTitle }), {
    onSuccess: () => {
      queryClient.invalidateQueries("board");
    },
  });
  const { data: users, isLoading: isUsersLoading } = useQuery(["usersBoard", board.id], () => fetchUsersByBoard(board.id));
  // const { data: user, isLoading: isUserLoading } = useQuery("user", fetchUser, {
  //   refetchOnWindowFocus: false,
  //   keepPreviousData: true,
  // });
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
  const handleTitleChange = (event) => {
    setNewTitle(event.target.value);
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
  async function handleRoleChange(userId, roleId) {
    await updateRole(userId, board.id, { roleId });
    queryClient.invalidateQueries(["usersBoard", board.id]);
  }
  const CreateRoleMutation = useMutation((data) => createRole(data, board.id), { onSuccess: () => queryClient.invalidateQueries(["roles"]) });
  const CreatePriorityMutation = useMutation((data) => createPriority(data, board.id), {
    onSuccess: () => queryClient.invalidateQueries(["priorities"]),
  });
  const AddStateMutation = useMutation((data) => addState(data, userId, board.id), { onSuccess: () => queryClient.invalidateQueries(["states"]) });
  const createRoleForBoard = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.target);
      const fields = Object.fromEntries(formData);

      // Преобразование значений чекбоксов
      fields.canEditBoardInfo = Boolean(fields.canEditBoardInfo);
      fields.canAddColumns = Boolean(fields.canAddColumns);
      fields.canAddUsers = Boolean(fields.canAddUsers);
      fields.canAddPriorities = Boolean(fields.canAddPriorities);
      fields.canCreateRoles = Boolean(fields.canCreateRoles);
      fields.canAccessStatistics = Boolean(fields.canAccessStatistics);
      fields.canCreateReports = Boolean(fields.canCreateReports);
      fields.canAccessArchive = Boolean(fields.canAccessArchive);

      handleCloseRolesModal();
      CreateRoleMutation.mutate(fields);
    } catch (error) {
      console.error(error);
    }
  };
  if (isRolesLoading || isUsersLoading) {
    return <div>1</div>;
  }

  return (
    <div className="board-header  h-[150px] p-[15px] space-y-5 ">
      <div>
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
        <MyModal open={openRolesModal} onClose={handleCloseRolesModal} header="Роли">
          <form onSubmit={(event) => createRoleForBoard(event, board.id)}>
            <div className="w-96 pt-5 rounded-lg">
              <div className="mb-4">
                <input required type="text" name="name" placeholder="Название роли" className="border-gray-300 border w-full px-3 py-2 rounded" />
              </div>

              <div className="mb-4 grid grid-cols-1 gap-3">
                {privileges.map((privilege, index) => (
                  <div key={privilege.id} className="flex items-center">
                    <input
                      className="mr-2"
                      name={privilege}
                      type="checkbox"
                      onChange={(e) => {
                        const checked = e.target.checked;
                      }}
                    />
                    <label key={privilege.id}>{privilege}</label>
                  </div>
                ))}
              </div>

              <div className="mb-4">
                <label className="block font-medium">Роли</label>
                {roles.map((role) => (
                  <div key={role.id}>
                    {role.name}
                    {/* <input disabled type="checkbox" checked={role.canEditBoardInfo}></input> */}
                  </div>
                ))}
              </div>
              <div className="flex justify-end">
                <button type="submit" className="px-4 py-2 rounded">
                  <SettingsAccessibilityIcon /> Создать роль
                </button>
              </div>
            </div>
          </form>
        </MyModal>
        <MyModal open={openAccessSettingsModal} onClose={handleCloseAccessSettingsModal} header="Права доступа">
          {users.map((user) => (
            <li key={user.id}>
              <span>
                {user.name} {user.isOwner && <strong>(Создатель)</strong>}
              </span>
              {!user.isOwner && (
                <select
                  value={user.roleId}
                  onChange={(e) => {
                    handleRoleChange(user.id, e.target.value);
                  }}>
                  <option value={0} selected>
                    Без роли
                  </option>
                  {roles.map((role, index) => (
                    <option key={index} value={role.id}>
                      {role.name}
                    </option>
                  ))}
                </select>
              )}
            </li>
          ))}
        </MyModal>
        <MyModal open={openAddUserModal} onClose={handleCloseAddUserModal} header="Добавить пользователя">
          <form onSubmit={(event) => handleAddUserInBoard(event, board.id)} className="">
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

          <form onSubmit={(event) => createPriorityForBoard(event, board.id)} className="">
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
        <MyModal open={openAddSectionModal} onClose={handleCloseAddSectionModal} header="Новая секция">
          <form onSubmit={handleAddState} className="flex flex-col items-start space-y-3">
            <input required type="text" name="title" placeholder="title" />
            <button type="submit">Добавить секцию</button>
          </form>
        </MyModal>
      </div>

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
              <h1 className="text-4xl font-bold">
                {board.title}#{board.id}
              </h1>
              <EditIcon onClick={handleEditClick} />
              <Dropdown>
                {isOwner ? (
                  <p
                    className=" mr-[0] cursor-pointer hover:text-red-500 flex items-center"
                    onClick={() => {
                      deleteBoard(userId, boardId);
                      window.location.href = "/boards";
                    }}>
                    <DeleteForeverIcon />
                    Удалить
                  </p>
                ) : null}
              </Dropdown>
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
      <div className="flex flex-row items-center space-x-[15px]">
        {isOwner || currentRole.canAddColumns ? (
          <button className="p-[6px]" onClick={handleOpenAddSectionModal}>
            <ViewColumnIcon /> Добавить секцию
          </button>
        ) : null}
        {isOwner || currentRole.canAddUsers ? (
          <button className="p-[6px]" onClick={handleOpenAddUserModal}>
            <PersonAddIcon /> Добавить пользователя
          </button>
        ) : null}
        {isOwner || currentRole.canAddPriorities ? (
          <button className="p-[6px]" onClick={handleOpenPriorityModal}>
            <PriorityHighIcon /> Добавить приоритет
          </button>
        ) : null}
        {isOwner || currentRole.canCreateRoles ? (
          <button className="p-[6px]" onClick={handleOpenRolesModal}>
            <SettingsAccessibilityIcon /> Роли
          </button>
        ) : null}
        {isOwner ? (
          <button className="p-[6px]" onClick={handleOpenAccessSettingsModal}>
            <SettingsAccessibilityIcon /> Настройки доступа
          </button>
        ) : null}
        {isOwner || currentRole.canAccessStatistics ? (
          <button className="p-[6px]">
            <LeaderboardIcon /> Статистика
          </button>
        ) : null}
        {isOwner || currentRole.canAccessStatistics ? (
          <button
            className="p-[6px]"
            onClick={() => {
              window.location.href = `/boards/${board.id}/archive`;
            }}>
            <ArchiveIcon /> Архив
          </button>
        ) : null}

      </div>
    </div>
  );
};

export default BoardHeader;
function stringToColor(string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

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
