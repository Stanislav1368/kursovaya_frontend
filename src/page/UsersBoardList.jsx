import React from "react";
import { useQuery } from "react-query";
import { fetchUsersByBoard } from "../api"; // Импортируйте функцию, которая вызывает API для получения пользователей по идентификатору доски

const UsersBoardList = ({ boardId }) => {
  const { data: users, isLoading } = useQuery(["usersBoard", boardId], () => fetchUsersByBoard(boardId));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {users.map((user) => (
        <div key={user.id}>{user.email}</div>
      ))}
    </div>
  );
};
export default UsersBoardList;