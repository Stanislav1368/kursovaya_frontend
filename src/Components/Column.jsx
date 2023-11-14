import React, { useState } from "react";
import Task from "../page/Task";
import MyModal from "./MyModal";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { ArrowLeft, ArrowLeftOutlined, ArrowLeftSharp, ArrowRight } from "@mui/icons-material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import AddIcon from "@mui/icons-material/Add";
import { addTask, updateTask } from "../api";
import { useMutation, useQueryClient } from "react-query";

const Column = ({ userId, users, priorities, boardId, state }) => {
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [selectedStateId, setSelectedStateId] = useState();
  const [currentStateId, setCurrentStateId] = useState(0);
  const [currentTaskId, setCurrentTaskId] = useState(0);
  const handleOpenTaskModal = (stateId) => {
    setOpenTaskModal(true);
    setSelectedStateId(stateId);
  };
  const handleCloseTaskModal = () => {
    setOpenTaskModal(false);
  };
  const [openNotifSuccessTask, setOpenNotifSuccessTask] = useState(false);
  const handleOpenNotifSuccessTask = () => {
    setOpenNotifSuccessTask(true);
    setTimeout(() => {
      setOpenNotifSuccessTask(false);
    }, 2000);
  };
  const queryClient = useQueryClient();
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
  const UpdateTaskMutation = useMutation((data) => updateTask(userId, boardId, currentStateId, currentTaskId, data), {
    onSuccess: () => queryClient.invalidateQueries(["states"]),
  });
  const handleDragStart = (e, stateId, taskId) => {
    console.log(stateId, taskId);
    setCurrentStateId(stateId);
    setCurrentTaskId(taskId);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    // e.target.style.border = "2px dashed";
  };
  const handleDrop = async (e, state) => {
    console.log();
    e.preventDefault();
    if (state.id === currentStateId) {
      return;
    }
    console.log(currentStateId, currentTaskId);
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
    <div className="state flex flex-col w-[350px] mr-4 overflow-y-auto " key={state.id}>
      <div className="state-header flex justify-between items-center p-4 ">
        <div className="items-center flex">
          <ArrowLeft />
          <span className="text-lg font-bold break-words">{state.title}</span>
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
              <Task userId={userId} boardId={boardId} state={state} task={task} index={index}></Task>
            </div>
          ))}
      </div>
    </div>
  );
};

export default Column;
