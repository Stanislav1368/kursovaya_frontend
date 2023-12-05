import React, { useCallback, useState } from "react";
import { useParams } from "react-router-dom";
import {
  addTask,
  deleteState,
  updateTask,
} from "../api";
import { useMutation, useQueryClient } from "react-query";
import Navbar from "../Components/Navbar";
import BoardHeader from "../Components/BoardHeader";
import Column from "../Components/Column";
import useBoardData from "../useBoardData";

const Board = () => {
  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [currentStateId, setCurrentStateId] = useState(0);
  const [currentTaskId, setCurrentTaskId] = useState(0);
  const [selectedStateId, setSelectedStateId] = useState();
  const { board, currentRole, isOwner, userId, priorities, users, states, isLoading } = useBoardData();
  const { boardId } = useParams();
  const queryClient = useQueryClient();
  const DeleteStateMutation = useMutation((stateId) => deleteState(userId, boardId, stateId), {
    onSuccess: () => queryClient.invalidateQueries(["states"]),
  });
  const UpdateTaskMutation = useMutation((data, newOrder) => updateTask(userId, boardId, currentStateId, currentTaskId, data, newOrder), {
    onSuccess: () => queryClient.invalidateQueries(["states"]),
  });
  if (isLoading) {
    return <div></div>;
  }
  const handleDragStart = (e, stateId, taskId) => {
    setCurrentStateId(stateId);
    setCurrentTaskId(taskId);
  };
  const handleDragOver = (e) => {
    e.preventDefault();
  };
  const handleDrop = async (e, state) => {
    e.preventDefault();
    if (state.id === currentStateId) {
      return;
    }
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
    <div>
      <Navbar userId={userId} boardId={boardId}></Navbar>
      <BoardHeader currentRole={currentRole} board={board} isOwner={isOwner} userId={userId} priorities={priorities} boardId={boardId}></BoardHeader>
      <div className="p-[15px] space-y-4">
        <div className="main flex flex-row h-[calc(100vh-230px)]">
          {states
            .sort((a, b) => a.id - b.id)
            .map((state) => (
              <Column
                key={state.id}
                state={state}
                users={users}
                priorities={priorities}
                DeleteStateMutation={DeleteStateMutation}
                handleDragStart={handleDragStart}
                handleDragEnd={handleDragEnd}
                handleDragOver={handleDragOver}
                handleDrop={handleDrop}
                userId={userId}
                boardId={boardId}
                currentRole={currentRole}
                dragLeaveHandler={dragLeaveHandler}
              />
            ))}
        </div>
      </div>
    </div>
  );
};

export default Board;

function stringToColor(string) {
  let hash = 0;
  let i;
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = "#";
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  return color;
}
function stringAvatar(name) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name[0][0] + name[1][0]}`,
  };
}
