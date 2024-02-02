import React from "react";
import Navbar from "../Components/Navbar";
import { useParams } from "react-router-dom";
import { fetchUserId, getIsArchivedTasks, taskChangeArchivingStatus } from "../api";
import { QueryClient, useQuery, useQueryClient } from "react-query";

const Archive = ({boardId}) => {
  // const { boardId } = useParams();
  const queryClient = useQueryClient();
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
      {/* <Navbar /> */}
      <main className="p-4 2xl:mx-[250px] mx-[0px] sm:mx-[0px] lg:mx-[0px]">
        {isArchivedTasks.length === 0 ? (
          <div className="text-center mt-8 text-gray-500">
            <p className="text-[34px]">В архиве пусто!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {isArchivedTasks.map((task) => (
              <div key={task.id} className="archivedTask overflow-hidden shadow-xl rounded-lg p-4 hover:shadow-md transition duration-300">
                <h3 className="text-xl font-semibold mb-2">{task.title}</h3>
                <p className="text-sm mb-4">{task.description}</p>
                <button
                  onClick={async () => {
                    await taskChangeArchivingStatus(userId, boardId, task.stateId, task.id, false);
                    await queryClient.invalidateQueries(["isArchivedTasks"]);
                  }}
                  className="px-2 py-1 rounded-md transition duration-300">
                  Восстановить
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Archive;
