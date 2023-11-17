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
  const { data: isArchivedTasks, isLoading: isIsArchivedTasksLoading } = useQuery("isArchivedTasks", () => getIsArchivedTasks(userId,boardId), {
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
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="overflow-hidden border  sm:rounded-lg">
            <table className="min-w-full divide-y ">
              <thead className="">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    ID
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Название
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Описание
                  </th>
                </tr>
              </thead>
              <tbody className=" divide-y ">
                {isArchivedTasks.map((task) => (
                  <tr key={task.id}>
                    <td className="px-6 py-4 whitespace-nowrap">{task.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{task.title}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{task.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Archive;
