import React, { useState } from "react";
import { useQuery, useQueryClient } from "react-query";
import { updateTaskIsCompleted, getTask, taskChangeArchivingStatus } from "../api";
import MyModal from "./MyModal";
import DescriptionIcon from "@mui/icons-material/Description";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import moment from "moment";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import Dropdown from "./Dropdown";
import ArchiveIcon from "@mui/icons-material/Archive";

const Task = ({ userId, boardId, state, task, currentRole, queryClient_ }) => {
  const queryClient = useQueryClient();

  // const DeleteTaskMutation = useMutation(() => DeleteTask(userId, boardId, state.id, task.id), {
  //   onSuccess: () => queryClient.invalidateQueries(["states"]),
  // });

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
    <div className={`items-center rounded p-4 `} key={task?.id}>
      <MyModal open={openTaskModal} onClose={handleCloseTaskModal} header={`${taskData.title}`}>
        <div className="w-[850px] overflow-y-auto flex flex-row p-[15px] justify-between">
          <div className="">
            <div>
              <div className=" text-xl ">
                <AccessTimeIcon />
                Срок
              </div>
              <p className="ms-[25px] italic">Создана: {moment.utc(task.createdAt).utcOffset(5).format("DD/MM/YYYY HH:mm")}</p>
              <p className="ms-[25px] italic">Дедлайн:{moment.utc(task.deadline).format("DD.MM.YYYY")}</p>
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
      <div className="flex justify-between ">
        <div className="flex justify-between w-full">
          <div className="flex">
            <p
              className={`text-base font-bold hover:text-blue-500 hover:underline ${taskData.isCompleted ? "line-through" : ""}`}
              onClick={handleOpenTaskModal}
              style={{ display: "flex", alignItems: "center" }}>
              {taskData.title}
            </p>
            <Dropdown>
              <button
                className="p-1"
                onClick={async () => {
                  await taskChangeArchivingStatus(userId, boardId, state.id, task.id, true);
                  await queryClient_.invalidateQueries(["tasks"]);
                }}>
                    <ArchiveIcon />
              </button>

              <button className="p-1 cursor-pointer hover:text-red-500 flex items-center" onClick={() => {}}>
                <DeleteForeverIcon />

              </button>
            </Dropdown>
          </div>
          {taskData.users.some((user) => user.id === userId) && (
            <input className="checkbox" type="checkbox" onChange={handleTaskCompletion} checked={taskData.isCompleted}></input>
          )}
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="pt-2 flex justify-between w-full">
          <div>
            {taskData.users?.map((user, index) => (
              <div key={index}>{user.name}</div>
            ))}
          </div>
          <div>
            {taskData.priority && (
              <label
                style={{ borderColor: taskData.priority?.color, backgroundColor: taskData.priority?.color, fontSize: "12px" }}
                className="label w-min rounded-[5px] px-[8px] border-[1px] items-center mb-[5px] font-bold text-3xl">
                {taskData.priority?.name}
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Task;
