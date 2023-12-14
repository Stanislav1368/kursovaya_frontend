// State.js
import React, { useState } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import AddIcon from "@mui/icons-material/Add";
import MyModal from "../Components/MyModal";
import Task from "../Components/Task";
import { ArrowLeft, ArrowRight } from "@mui/icons-material";
import Dropdown from "../Components/Dropdown";
import { addTask, getTasks } from "../api";
import Notification from "./Notification";
import { useQuery, useQueryClient } from "react-query";

const Column = ({
  state,
  users,
  priorities,
  DeleteStateMutation,
  handleDragStart,
  handleDragEnd,
  handleDragOver,
  handleDrop,
  userId,
  boardId,
  currentRole,
  dragLeaveHandler,
}) => {
  const {
    data: tasks,
    isLoading: isTasksLoading,
    refetch,
  } = useQuery(["tasks", userId, boardId, state.id], () =>
    getTasks(userId, boardId, state.id).then((data) => data.filter((task) => !task.isArchived))
  );
  const queryClient = useQueryClient();
  const [selectedStateId, setSelectedStateId] = useState();
  const [openTaskModal, setOpenTaskModal] = useState(false);
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
  const handleAddTask = async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    if (!validateForm(formData)) {
      alert("Пожалуйста, заполните все обязательные поля");
      return; // Прерываем отправку формы
    }
    try {
      const formData = new FormData(event.target);
      const fields = {};
      for (const [name, value] of formData.entries()) {
        if (name === "userIds") {
          if (!fields[name]) {
            fields[name] = [value]; // Преобразуем значение в массив
          } else {
            if (!Array.isArray(fields[name])) {
              fields[name] = [fields[name]]; // Если значение не массив, делаем его массивом
            }
            fields[name].push(value);
          }
        } else {
          fields[name] = value;
        }
      }
      console.log(fields);
      await addTask(fields, userId, boardId, selectedStateId);

      handleCloseTaskModal();
      handleOpenNotifSuccessTask();
      await queryClient.invalidateQueries(["tasks"]);
    } catch (error) {
      console.error(error);
    }
  };
  const validateForm = (formData) => {
    const title = formData.get('title');
    const description = formData.get('description');
    const deadline = formData.get('deadline');
    const userIds = formData.getAll('userIds');
  
    if (!title || !description || !deadline || userIds.length === 0) {
      return false; // Если хотя бы одно из обязательных полей не заполнено
    }
    return true; // Все обязательные поля заполнены
  };
  
  return (
    <div className="state flex flex-col w-[350px] mr-4 overflow-y-auto" key={state.id}>
      <Notification status="success" open={openNotifSuccessTask}>
        Задача успешно добавлена
      </Notification>
      <div className="state-header flex justify-between items-center p-4 ">
        <div className="items-center flex">
          <ArrowLeft />
          <span className="text-2xl font-bold break-words">{state.title}</span>
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
              <div className="mb-4">
                <input required className="rounded-md p-2" type="text" name="title" placeholder="Title" />
              </div>
              <div className="mb-4">
                <input required className="rounded-md p-2" type="text" name="description" placeholder="Description" />
              </div>
              <div className="mb-4">
                <label>Дедлайн: </label>
                <input type="datetime-local" name="deadline" className="rounded-md p-2" />
              </div>
              <div className="flex flex-col mb-4">
                {users.map((user, index) => (
                  <div key={index} className="flex items-center">
                    <input type="checkbox" name="userIds" value={user.id} className="mr-2" />
                    <label>
                      {user.name}#{user.id}
                    </label>
                  </div>
                ))}
              </div>
              <div className="mb-4">
                <select name="priorityId" className="block rounded-md p-2">
                  {priorities.map((priority, index) => (
                    <option key={index} value={priority.id}>
                      {priority.name}
                    </option>
                  ))}
                </select>
              </div>
              <button type="submit" className="">
                Add Task
              </button>
            </form>
          </MyModal>
          <DeleteForeverIcon className="ml-2 cursor-pointer hover:text-red-500" onClick={() => DeleteStateMutation.mutate(state.id)} />
          <ArrowRight />
        </div>
      </div>
      <div
        className="column h-full space-y-[15px]"
        onDragLeave={(e) => dragLeaveHandler(e)}
        onDragOver={(e) => handleDragOver(e)}
        onDrop={(e) => handleDrop(e, state)}>
        {tasks &&
          tasks
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
                <Task userId={userId} boardId={boardId} state={state} task={task} currentRole={currentRole} queryClient_={queryClient} />
              </div>
            ))}
      </div>
    </div>
  );
};

export default Column;
