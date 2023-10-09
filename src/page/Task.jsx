import React from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { AddTask, DeleteTask } from "../api";

const Task = ({ userId, boardId, state, task, index }) => {
  const queryClient = useQueryClient();

  const DeleteTaskMutation = useMutation(
    () => DeleteTask(userId, boardId, state.id, task.id),
    { onSuccess: () => queryClient.invalidateQueries(["states"]) }
  );

  return (
    <div
      className={`items-center rounded p-4 ${index > 0 ? "mt-4" : ""}`}
      key={task.id}
    >
      <div className="flex justify-between ">
        <p className=" text-base  font-bold">{task.title}</p>
        <p>12.12.23</p>
      </div>
      <div className="pt-2">
        <div>Luis Ballas</div>
        <div>Jeremy Hall</div>

      </div>
    </div>
  );
};

export default Task;
