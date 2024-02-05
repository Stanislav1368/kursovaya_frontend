import React, { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { updateTaskIsCompleted, getTask, taskChangeArchivingStatus, deleteTask } from "../../api";
import MyModal from "../MyModal/MyModal";
import DescriptionIcon from "@mui/icons-material/Description";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import moment from "moment";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Dropdown from "../Dropdown/Dropdown";
import ArchiveIcon from "@mui/icons-material/Archive";
import "./Task.css";

const Task = ({ userId, boardId, state, task, currentRole, queryClient_ }) => {
  const queryClient = useQueryClient();

  const DeleteTaskMutation = useMutation(() => deleteTask(userId, boardId, state.id, task.id), {
    onSuccess: () => queryClient.invalidateQueries(["tasks"]),
  });

  const [openTaskModal, setOpenTaskModal] = useState(false);
  const handleOpenTaskModal = () => {
    setOpenTaskModal(true);
  };
  const handleCloseTaskModal = () => {
    setOpenTaskModal(false);
  };
  // const [isOpen, setIsOpen] = useState(false);

  // const handleToggleMenu = () => {
  //   setIsOpen(!isOpen);
  // };
  const { data: taskData, isLoading: isTaskLoading } = useQuery(
    ["task", userId, boardId, state.id, task.id],
    () => getTask(userId, boardId, state.id, task.id),
    { refetchOnWindowFocus: true }
  );

  const handleTaskCompletion = () => {
    const updatedIsCompleted = !taskData.isCompleted;
    updateTaskIsCompleted(userId, boardId, state.id, taskData.id, { isCompleted: updatedIsCompleted }).then(() => {
      queryClient.setQueryData(["task", userId, boardId, state.id, taskData.id], (oldData) => {
        return {
          ...oldData,
          isCompleted: updatedIsCompleted,
        };
      });
    });
  };

  if (isTaskLoading) {
    return <div></div>;
  }
  return (
    // ${index > 0 ? "mt-4" : ""}
    <>
      <MyModal open={openTaskModal} onClose={handleCloseTaskModal} header={`${taskData.title}`}>
        <div className="w-[850px] overflow-y-auto flex flex-row p-[15px] justify-between">
          <div className="">
            <div>
              <div className=" text-xl ">
                <AccessTimeIcon />
                Срок
              </div>
              <p className="ms-[25px] italic">Создана: {moment.utc(task.createdAt).utcOffset(5).format("DD/MM/YYYY HH:mm")}</p>
              <p className="ms-[25px] italic">Дедлайн:{moment.utc(task.endDate).format("DD.MM.YYYY")}</p>
            </div>
            <div>
              <div className="text-xl">
                <DescriptionIcon />
                Описание
              </div>
              <p className="px-[10px] ms-4 italic">{task.description}</p>
            </div>
            {/* <div className="">
              <div className="text-xl">
                <CommentIcon />
                Комментарии
              </div>
            </div> */}
          </div>
          {/* <div className="flex flex-col space-y-[15px]">
            <label>Добавить на карточку (В процессе)</label>
            <button className="text-left ">Участники</button>
            <button className="text-left ">Метка</button>
            <button className="text-left ">Срок</button>
            <button className="text-left">Вложения</button>
          </div> */}
        </div>
      </MyModal>
      <div className="task">
        <div className="">
          <div className="">
            <div style={{ display: "flex", gap: "1px", alignItems: "center" }} className="">
              <h2 className={`${taskData.isCompleted ? "line-through" : ""}`} onClick={handleOpenTaskModal}>
                {taskData.title}
              </h2>
              <Dropdown>
                <button
                  className=""
                  onClick={async () => {
                    await taskChangeArchivingStatus(userId, boardId, state.id, task.id, true);
                    await queryClient_.invalidateQueries(["tasks"]);
                  }}>
                  <ArchiveIcon />
                </button>

                <button
                  onClick={() => {
                    DeleteTaskMutation.mutate();
                  }}>
                  <DeleteForeverIcon />
                </button>
              </Dropdown>
              {taskData.users.some((user) => user.id === userId) && (
                <input className="checkbox" type="checkbox" onChange={handleTaskCompletion} checked={taskData.isCompleted}></input>
              )}
            </div>
          </div>
        </div>
        <div className="">
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }} className="">
            <div>
              {taskData.users?.map((user, index) => (
                <div key={index}>{user.name}</div>
              ))}
            </div>
            <div>
              {taskData.priority && (
                <label
                  style={{
                    borderColor: taskData.priority?.color,
                    backgroundColor: taskData.priority?.color,
                    fontSize: "12px",
                    padding: "2px",
                    borderRadius: "5px",
                  }}
                  className="">
                  {taskData.priority?.name}
                </label>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Task;
