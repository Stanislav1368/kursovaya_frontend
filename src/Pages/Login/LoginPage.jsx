import React, { useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { login } from "../../api";
import "./LoginPage.css";

const LoginPage = () => {
  const [error, setError] = useState(false);
  const mutation = useMutation((data) => login(data));
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.target);
      const fields = Object.fromEntries(formData);
      await mutation.mutateAsync(fields); // Используйте mutateAsync вместо mutate
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  // Обработка успешного ответа после выполнения мутации внутри функции
  // mutateAsync
  if (mutation.isSuccess) {
    navigate("/boards");
  }

  return (
    <div class="login-container">
      <form class="login-form" onSubmit={handleLogin}>
        <h1>Вход</h1>
        <div class="input-group">
          <label for="email">Почта</label>
          <input type="email" name="email" id="email" placeholder="Почта" required />
        </div>
        <div class="input-group">
          <label for="password">Пароль</label>
          <input type="password" name="password" id="password" placeholder="Пароль" required />
        </div>
        <div className="button-group">
          <button className="login-btn" type="submit">Войти</button>
          {error ? <span className="error-message">Неверная почта или пароль</span> : null}
          <a href="/registration">Регистрация</a>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
