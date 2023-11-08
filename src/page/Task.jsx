import React, { useState } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { AddTask, DeleteTask } from "../api";
import MyModal from "./MyModal";
import DescriptionIcon from "@mui/icons-material/Description";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CommentIcon from "@mui/icons-material/Comment";
import moment from "moment";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { motion } from "framer-motion";
const Task = ({ userId, boardId, state, task, index }) => {
  const queryClient = useQueryClient();

  const DeleteTaskMutation = useMutation(() => DeleteTask(userId, boardId, state.id, task.id), {
    onSuccess: () => queryClient.invalidateQueries(["states"]),
  });
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const handleOpenTaskModal = () => {
    setOpenTaskModal(true);
  };
  const handleCloseTaskModal = () => {
    setOpenTaskModal(false);
  };
  const [isOpen, setIsOpen] = useState(false);

  const variants = {
    open: { opacity: 1, y: 0 },
    closed: { opacity: 0, y: -10 },
  };

  const handleToggleMenu = () => {
    setIsOpen(!isOpen);
  };
  return (
    <div className={`items-center rounded p-4 ${index > 0 ? "mt-4" : ""}`} key={task?.id}>
      <MyModal open={openTaskModal} onClose={handleCloseTaskModal} header={`${task.title}`}>
        <div className="w-[850px] overflow-y-auto flex flex-row p-[15px] justify-between">
          <div className="">
            <div>
              <div className=" text-xl ">
                <AccessTimeIcon />
                Срок
              </div>
              <p className="ms-[25px] italic">Создана: {moment.utc(task.createdAt).format("MM/DD/YYYY HH:mm")}</p>
              <p className="ms-[25px] italic">Дедлайн: {moment.utc(task.createdAt).format("MM/DD/YYYY HH:mm")}</p>
            </div>
            <div>
              <div className="text-xl">
                <DescriptionIcon />
                Описание
              </div>
              <p className="p-[10px] ms-4 italic">{task.description}</p>
            </div>
            <div className="">
              <div className="text-xl">
                <CommentIcon />
                Комментарии
              </div>
            </div>
          </div>
          <div className="flex flex-col space-y-[15px]">
            <label>Добавить на карточку</label>
            <button className="text-left ">Участники</button>
            <button className="text-left ">Метка</button>
            <button className="text-left ">Срок</button>
            <button className="text-left">Вложения</button>
          </div>
        </div>
      </MyModal>
      <div className="flex justify-between ">
        <div className="flex justify-between w-full">
          <p className="text-base font-bold" onClick={handleOpenTaskModal}>
            {task?.title}
          </p>
          <div class="dropdown">
            <button class="dropbtn">Dropdown</button>
            <div class="dropdown-content">
              <a href="#">Link 1</a>
              <a href="#">Link 2</a>
              <a href="#">Link 3</a>
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-between items-center">
        <div className="pt-2 flex justify-between w-full">
          <div>
            {task?.users.map((user, index) => (
              <div key={index}>{user.name}</div>
            ))}
          </div>
          <div>
            {task?.priority && (
              <label
                style={{ borderColor: task?.priority?.color, backgroundColor: task?.priority?.color, fontSize: "12px" }}
                className="label w-min rounded-[5px] px-[8px] border-[1px] items-center mb-[5px] font-bold text-3xl">
                {task?.priority?.name}
              </label>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Task;
