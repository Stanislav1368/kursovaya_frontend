import React from "react";
import Column from "../Components/Column";
import { useQuery } from "react-query";
import { fetchStates, fetchUserId } from "../api";
import { useParams } from "react-router-dom";

const TestBoard = () => {
  const { boardId } = useParams();
  const { data: userId, isLoading: isUserIdLoading } = useQuery("userId", fetchUserId, {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
  const { data: states, isLoading: isStatesLoading } = useQuery("states", () => fetchStates(userId, boardId), {
    enabled: !!userId,
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
  
  if (isUserIdLoading || isStatesLoading) {
    return <div></div>;
  }
  return (
    <div className="flex my-[100px] w-screen h-screen">
      <div className="w-[40%] flex">
        {states.map((state) => {
          return <Column key={state.id} column={state} boardId={boardId}></Column>;
        })}
      </div>
    </div>
  );
};

export default TestBoard;
