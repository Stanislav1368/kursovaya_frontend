import { useState } from "react";
import React, { useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import SocketApi, { AddBoard, deleteBoard, deleteState, fetchBoards, fetchStates, fetchUser, fetchUserId, updateBoard, updateTask } from "../../api";
import useBoardData from "../../useBoardData";

import Column from "../../Components/Column";
import moment from "moment/moment";
import Notification from "../../Components/Notification";
import "./Boards.css";
import AddBoxIcon from "@mui/icons-material/AddBox";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DisabledByDefaultIcon from "@mui/icons-material/DisabledByDefault";
import { useContext } from "react";
import ThemeContext from "../../ThemeContext";
import { DarkMode, LightMode } from "@mui/icons-material";
import BoardHeader from "../../Components/boardHeader/BoardHeader";
import Archive from "../Archive";

const ListBoards = ({ boards, selectedBoard, onBoardSelect, onBoardAdd }) => {
  const [isInputVisible, setInputVisible] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  const handleOpenNotif = () => {
    setOpenNotif(true);
    setTimeout(() => {
      setOpenNotif(false);
    }, 2000);
  };

  const handleAddBoard = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData);
      // handleCloseAddBoardModal();
      await onBoardAdd(data); // Вызываем колбэк для добавления новой доски
      handleOpenNotif();
      setInputVisible(!isInputVisible);
    } catch (error) {
      console.error(error);
    }
  };
  const { theme, updateTheme } = useContext(ThemeContext);

  const handleButtonClick = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    updateTheme(newTheme);
  };
  return (
    <div>
      <Notification status="success" open={openNotif}>
        Доска успешно создана
      </Notification>
      <div style={{ listStyleType: "none", padding: 0, margin: 0, display: "flex", alignItems: "stretch", gap: "10px" }}>
        {boards.map((board) => (
          <button key={board.id} onClick={() => onBoardSelect(board.id)} className={`${selectedBoard?.id === board?.id ? "tab-selected" : "tab"}`}>
            {board.title}
          </button>
        ))}
        {isInputVisible && (
          <>
            <form onSubmit={handleAddBoard} className="">
              <input required type="text" name="title" placeholder="title" />
              <button className="icon-button" type="submit">
                <CheckBoxIcon className="ok"></CheckBoxIcon>
              </button>
            </form>
            <button
              className="icon-button"
              onClick={() => {
                setInputVisible(!isInputVisible);
              }}>
              <DisabledByDefaultIcon className="close" />
            </button>
          </>
        )}
        {!isInputVisible && (
          <button
            className="icon-button"
            onClick={() => {
              setInputVisible(!isInputVisible);
            }}>
            <AddBoxIcon />
          </button>
        )}

        {theme === "light" ? (
          <button className="icon-button" onClick={handleButtonClick}>
            <LightMode onClick={handleButtonClick} />
          </button>
        ) : (
          <button className="icon-button" onClick={handleButtonClick}>
            <DarkMode onClick={handleButtonClick} />
          </button>
        )}
      </div>
    </div>
  );
};

const BoardContent = ({ board, onBoardDelete, handleChangeBoardTitle }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("kanban");
  useEffect(() => {
    SocketApi.createConnection();
    SocketApi.socket.on("newState", () => {
      queryClient.invalidateQueries(["states"]);
    });
    SocketApi.socket.on("deleteState", () => {
      queryClient.invalidateQueries(["states"]);
    });
    return () => {
      SocketApi.socket.off("deleteState");
    };
  }, []);

  const [openTaskModal, setOpenTaskModal] = useState(false);
  const [currentStateId, setCurrentStateId] = useState(0);
  const [currentTaskId, setCurrentTaskId] = useState(0);
  const [selectedStateId, setSelectedStateId] = useState();
  const { currentRole, isOwner, userId, priorities, users, isLoading } = useBoardData(board.id);
  const DeleteStateMutation = useMutation((stateId) => deleteState(userId, board.id, stateId), {
    onSuccess: () => queryClient.invalidateQueries(["states"]),
  });
  const UpdateTaskMutation = useMutation((updatedData) => updateTask(userId, board.id, currentStateId, currentTaskId, updatedData), {
    onSuccess: () => {
      queryClient.invalidateQueries(["tasks"]);
      queryClient.invalidateQueries(["states", board.id]);
    },
  });
  const { data: states } = useQuery(["states", board.id], () => fetchStates(userId, board.id), {
    enabled: !!userId, // Активировать запрос только если userId существует
    refetchOnWindowFocus: false, // Отключить автоматическое обновление при фокусировке окна
    keepPreviousData: true, // Оставить предыдущие данные при загрузке
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
    <>
      {board ? (
        <div>
          <BoardHeader
            onBoardDelete={onBoardDelete}
            currentRole={currentRole}
            board={board}
            isOwner={isOwner}
            userId={userId}
            priorities={priorities}
            boardId={board.id}
            handleChangeBoardTitle={handleChangeBoardTitle}
          />
          <div style={{ marginTop: "10px" }}>
            <div style={{ marginLeft: "0px" }}>
              <button className={activeTab === "kanban" ? "slct-view" : "view"} onClick={() => setActiveTab("kanban")}>
                kanban
              </button>
              <button className={activeTab === "archive" ? "slct-view" : "view"} onClick={() => setActiveTab("archive")}>
                archive
              </button>
              <button className={activeTab === "gantt" ? "slct-view" : "view"} onClick={() => setActiveTab("gantt")}>
                gantt
              </button>
            </div>

            <TabContent tabName="kanban" activeTab={activeTab}>
              {states && states.length > 0 ? (
                <div className="columns">
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
                        boardId={board.id}
                        currentRole={currentRole}
                        dragLeaveHandler={dragLeaveHandler}
                      />
                    ))}
                </div>
              ) : (
                <div className="columns">
                  <p>Здесь пока что пусто. Добавьте столбцы, чтобы начать работу!</p>
                </div>
              )}
            </TabContent>
            <TabContent tabName="archive" activeTab={activeTab}>
              <Archive boardId={board.id}></Archive> 
            </TabContent>
            <TabContent tabName="gantt" activeTab={activeTab}>
              <GanttChart data={states}></GanttChart>
            </TabContent>
          </div>
        </div>
      ) : (
        <div>Выберите доску для отображения содержимого</div>
      )}
    </>
  );
};

const GanttChart = ({ data }) => {
  const allTasks = data?.reduce((accumulator, state) => {
    return accumulator.concat(state.tasks);
  }, []);

  const allDates = allTasks?.reduce((dates, task) => {
    const startDate = new Date(task.startDate);
    const endDate = task.endDate ? new Date(task.endDate) : startDate;
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate).toISOString().split("T")[0]);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }, []);

  const uniqueDates = [...new Set(allDates)];
  uniqueDates.sort((a, b) => new Date(a) - new Date(b));

  return (
    <div>
      <div style={{ overflowX: "auto" }}>
        <table style={{ borderSpacing: "0" }}>
          <thead>
            <tr>
              <th>Название задачи</th>
              {uniqueDates.map((date, index) => (
                <th key={index}>{new Date(date).toLocaleDateString("en-US", { day: "numeric", month: "short" })}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data?.map((state, stateIndex) => (
              <React.Fragment key={stateIndex}>
                <tr>
                  <th>{state.title}</th>
                </tr>
                {state.tasks.map((task, taskIndex) => (
                  <tr key={taskIndex}>
                    <td>{task.title}</td>
                    {uniqueDates.map((date, dateIndex) => {
                      console.log(
                        moment.utc(task.startDate).format("DD.MM.YYYY"),
                        date,
                        task.startDate <= date && (!task.endDate || task.endDate >= date)
                      );
                      return moment.utc(task.startDate).startOf("day") <= moment.utc(date).startOf("day") &&
                        (!task.endDate || moment.utc(task.endDate).startOf("day") >= moment.utc(date).startOf("day")) ? (
                        <td key={dateIndex} style={{ background: "lightblue" }}></td>
                      ) : (
                        <td key={dateIndex}></td>
                      );
                    })}
                  </tr>
                ))}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const Boards = () => {
  const [boards, setBoards] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const { data: userId } = useQuery("userId", fetchUserId, {
    refetchOnWindowFocus: false,
    keepPreviousData: true,
  });

  const [openAddBoardModal, setOpenAddBoardModal] = useState(false);
  const [openNotif, setOpenNotif] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userData = await fetchUser();
        const userId = userData.id;
        const boardsData = await fetchBoards(userId);

        const cleanedBoards = boardsData.map((board) => {
          const { UserBoards, ...cleanedBoard } = board; // Создаем новый объект без поля UserBoards
          return cleanedBoard;
        });
        console.log(cleanedBoards);
        setBoards(cleanedBoards);
      } catch (error) {
        console.error("Ошибка при получении досок:", error);
      }
    };

    fetchData(); // Вызываем нашу асинхронную функцию fetchData для получения данных
  }, [userId]);
  const handleBoardSelect = (boardId) => {
    setSelectedBoard(boards.find((board) => board.id === boardId));
  };

  const handleBoardDelete = (boardId) => {
    setBoards(boards.filter((board) => board.id !== boardId));
    setSelectedBoard(null);
    console.log(boardId);
    deleteBoard(userId, boardId);
  };
  const handleAddBoard = async (data) => {
    try {
      const newBoard = await AddBoard(data, userId);
      setBoards([...boards, newBoard]); // Обновляем список досок в родительском компоненте, добавляя новую доску к существующему массиву
    } catch (error) {
      console.error(error);
    }
  };

  const handleChangeBoardTitle = async (boardId, newTitle) => {
    try {
      // Отправляем запрос на обновление заголовка доски
      const changedBoard = await updateBoard(userId, boardId, { title: newTitle });

      // После успешного обновления, обновляем данные в состоянии
      const updatedBoards = boards.map((board) => {
        // Если это доска, которую мы обновляли, возвращаем обновленную версию
        if (board.id === boardId) {
          return { ...board, title: newTitle };
        }
        // В противном случае возвращаем исходную доску
        return board;
      });

      // Обновляем состояние с обновленными данными для досок
      setBoards(updatedBoards);
      console.log(selectedBoard);
      setSelectedBoard((prevSelectedBoard) => ({
        ...prevSelectedBoard,
        title: newTitle,
      }));
      console.log(selectedBoard);
    } catch (error) {
      console.error(error);
    }
  };
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%" }}>
      <ListBoards
        userId={userId}
        boards={boards}
        selectedBoard={selectedBoard}
        onBoardAdd={handleAddBoard}
        onBoardSelect={handleBoardSelect}
        onBoardDelete={handleBoardDelete}
      />
      {selectedBoard && (
        <BoardContent
          key={selectedBoard.id}
          board={selectedBoard}
          onBoardDelete={handleBoardDelete}
          handleChangeBoardTitle={handleChangeBoardTitle}
        />
      )}
    </div>
  );
};

export default Boards;

const TabContent = ({ tabName, activeTab, children }) => {
  if (tabName === activeTab) {
    return <div className="slct-tab">{children}</div>;
  }
  return null;
};
