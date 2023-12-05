import React from "react";
import Navbar from "../Components/Navbar";
import { useParams } from "react-router-dom";
import { fetchUserId, getIsArchivedTasks } from "../api";
import { useQuery } from "react-query";

const Archive = () => {
  const { boardId } = useParams();

  const { data: userId, isLoading: isUserIdLoading } = useQuery("userId", fetchUserId, {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
  const { data: isArchivedTasks, isLoading: isIsArchivedTasksLoading } = useQuery("isArchivedTasks", () => getIsArchivedTasks(userId, boardId), {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });
  if (isIsArchivedTasksLoading) {
    return <div></div>;
  }

  return (
    <div>
      <Navbar />
      <main>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {isArchivedTasks.map((task) => (
            <div key={task.id} className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">{task.description}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Archive;
