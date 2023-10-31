import React from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { AddTask, DeleteTask } from "../api";

const Task = ({ userId, boardId, state, task, index }) => {
  const queryClient = useQueryClient();

  const DeleteTaskMutation = useMutation(() => DeleteTask(userId, boardId, state.id, task.id), {
    onSuccess: () => queryClient.invalidateQueries(["states"]),
  });

  return (
    <div className={`items-center rounded p-4 ${index > 0 ? "mt-4" : ""}`} key={task?.id}>
      <div className={`flex ${`task?.priority?.color ? bg-[${task?.priority?.color}] : ""`} h-[5px]`}></div>
      <div className="flex justify-between ">
        <p className="text-base font-bold">{task?.title}</p>
        <p>{task?.priority?.color}</p>
      </div>
      <div className="pt-2">
        {task?.users.map((user, index) => (
          <div key={index}>
            {user.name}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Task;
