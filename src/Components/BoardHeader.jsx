import React from "react";

const BoardHeader = ({}) => {
  return (
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
  );
};

export default BoardHeader;
