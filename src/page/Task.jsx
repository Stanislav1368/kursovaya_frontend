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
      <div className="flex justify-between ">
        <p className="text-base font-bold">{task?.title}</p>
        <p>{task?.priority?.color}</p>
      </div>
      <div className="flex justify-between items-center">
        <div className="pt-2">
          {task?.users.map((user, index) => (
            <div key={index}>{user.name}</div>
          ))}
        </div>
        {task?.priority && (
          <div
            style={{ borderColor: task?.priority?.color, color: task?.priority?.color, fontSize: "12px" }}
            className="label h-[20px] w-min rounded-[999px] px-[8px] border-[1px] items-center">
            {task?.priority?.name}
          </div>
        )}
      </div>
    </div>
  );
};

export default Task;
