import "./App.css";
import Board from "./Pages/Board";
import ThemeContext from "./ThemeContext";
import LoginPage from "./Pages/Login/LoginPage";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import RegistrationPage from "./Pages/Registration/RegistrationPage";
import { useEffect, useState } from "react";
import Archive from "./Pages/Archive";
import { jwtDecode } from "jwt-decode";
import Boards from "./Pages/Boards/Boards";


const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (token) {
    const decodedToken = jwtDecode(token); // декодирование токена
    return decodedToken.exp * 1000 > Date.now(); // проверка срока действия токена
  }
  return false;
};
const RequireAuth = ({ children }) => {
  if (isAuthenticated()) {
    return children;
  } else {
    // Проверка на устаревший токен и перенаправление на страницу входа
    return <Navigate to="/login" replace />;
  }
};

function App() {
  const [theme, setTheme] = useState(getSavedTheme() || "light");

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
              }></Route>
            <Route
              index
              path="boards/"
              element={
                <RequireAuth>
                  <ThemeContext.Provider value={{ theme, updateTheme }}>
                    <Boards />
                  </ThemeContext.Provider>
                </RequireAuth>
              }></Route>
            <Route
              path="boards/:boardId"
              element={
                <RequireAuth>
                  <ThemeContext.Provider value={{ theme, updateTheme }}>
                    <Board />
                  </ThemeContext.Provider>
                </RequireAuth>
              }></Route>
            <Route
              path="boards/:boardId/archive"
              element={
                <RequireAuth>
                  <ThemeContext.Provider value={{ theme, updateTheme }}>
                    <Archive />
                  </ThemeContext.Provider>
                </RequireAuth>
              }></Route>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/registration" element={<RegistrationPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
