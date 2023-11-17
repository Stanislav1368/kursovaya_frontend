import React from "react";
import { useQuery } from "react-query";
import { fetchUsersByBoard } from "../api";

const UsersBoardList = ({ boardId }) => {
  const { data: users, isLoading } = useQuery(["usersBoard", boardId], () => fetchUsersByBoard(boardId));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">
      {users.map((user) => (
        <div key={user.id} className="pr-1">{user.email}</div>
      ))}
    </div>
  );
};
export default UsersBoardList;