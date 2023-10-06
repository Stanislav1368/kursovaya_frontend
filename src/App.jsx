import "./App.css";
import Board from "./page/Board";
import BoardsList from "./page/BoardsList";
import ThemeContext from "./ThemeContext";
import LoginPage from "./page/LoginPage";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import RegistrationPage from "./page/RegistrationPage";
import { useEffect, useState } from "react";

const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  return token;
};
const RequireAuth = ({ children }) => {
  return isAuthenticated() ? children : <Navigate to="/login" />;
};

function App() {
  const [theme, setTheme] = useState(getSavedTheme() || 'light');

  // Функция для обновления значения темы
  useEffect(() => {
    setSavedTheme(theme);
  }, [theme]);

  const updateTheme = (newTheme) => {
    setTheme(newTheme);
  };

  function getSavedTheme() {
    return localStorage.getItem("theme");
  }

  function setSavedTheme(theme) {
    localStorage.setItem("theme", theme);
  }
  return (
    <div className={`App ${theme}`}>
      <BrowserRouter>
        <Routes>
          <Route path="/">
            <Route
              index
              element={
                <RequireAuth>
                  <Navigate to="/boards" />
                </RequireAuth>
              }
            ></Route>
            <Route
              index
              path="boards/"
              element={
                <RequireAuth>
                  <ThemeContext.Provider value={{ theme, updateTheme }}>
                    <BoardsList />
                  </ThemeContext.Provider>
                </RequireAuth>
              }
            ></Route>
            <Route
              path="boards/:boardId"
              element={
                <RequireAuth>
                  <ThemeContext.Provider value={{ theme, updateTheme }}>
                    <Board />
                  </ThemeContext.Provider>
                </RequireAuth>
              }
            ></Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registration" element={<RegistrationPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
