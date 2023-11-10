import React, { useState } from "react";
import Todo from "./Todo";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { UpdateTask, fetchUserId } from "../api";

const Column = ({ column, boardId }) => {
  const { data: userId, isLoading: isUserIdLoading } = useQuery("userId", fetchUserId, {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
  const [currentStateId, setCurrentStateId] = useState(0);
  const [currentTaskId, setCurrentTaskId] = useState(0);
  const queryClient = useQueryClient();
  const handleDragStart = (e, stateId, taskId) => {
    setCurrentStateId(stateId);
    setCurrentTaskId(taskId);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    e.target.style.border = "2px dashed";
  };

  const handleDrop = async (e, column) => {
    e.preventDefault();
    e.target.style.border = "none";
    console.log(currentStateId, currentTaskId);
    UpdateTaskMutation.mutate(column.id);
  };
  const handleDragEnd = (e) => {
    e.preventDefault();
    e.target.style.border = "none";
  };
  const handleDragLeaver = (e) => {
    e.preventDefault();
    e.target.style.border = "none";
  };
  const UpdateTaskMutation = useMutation((data) => UpdateTask(userId, boardId, currentStateId, currentTaskId, data), {
    onSuccess: () => queryClient.invalidateQueries(["states"]),
  });
  return (
    <div className="flex">
      <div className="bg-green-700 w-[25px]"></div>
      <div
        draggable
        onDragLeave={(e) => handleDragLeaver(e)}
        onDragOver={(e) => handleDragOver(e)}
        onDrop={(e) => handleDrop(e, column)}
        className="state h-full w-full">
        <h1 className="state-header text-2xl bg-gray-300">{column.title}</h1>
        <div className="bg-gray-400">
          {column.tasks.map((task, index) => {
            return (
              <div
                onDragOver={(e) => e.stopPropagation()}
                onDragLeave={(e) => handleDragLeaver(e)}
                onDragStart={handleDragStart(column.id, task.id)}
                onDragEnd={(e) => handleDragEnd(e)}
                draggable
                key={task.id}>
                <Todo todo={task} index={index}></Todo>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Column;
