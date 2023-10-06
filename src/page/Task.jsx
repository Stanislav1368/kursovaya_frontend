import React from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { AddTask, DeleteTask } from "../api";

const Task = ({ userId, boardId, state, task, index }) => {
  const queryClient = useQueryClient();

  const DeleteTaskMutation = useMutation(() => DeleteTask(userId, boardId, state.id, task.id), { onSuccess: () => queryClient.invalidateQueries(["states"]) });  

  return (
    <div  className={`flex justify-between items-center rounded p-4 ${index > 0 ? "mt-4" : ""}`} key={task.id}>
      {task.title}
      <DeleteForeverIcon className="cursor-pointer hover:text-red-500" onClick={() => DeleteTaskMutation.mutate()} />
    </div>
  );
};

export default Task;
