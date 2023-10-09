import React, { useState } from "react";
import { useMutation } from "react-query";
import { useNavigate } from "react-router-dom";
import { Login } from "../api";

const LoginPage = () => {
  const [error, setError] = useState(false);
  const mutation = useMutation((data) => Login(data));
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
    <div className="flex items-center justify-center h-[100%] ">
      <div className="form-login flex flex-col justify-between items-center  h-[400px] w-[400px] ">
        <form
          onSubmit={handleLogin}
          className=" px-10 flex flex-col justify-between items-center  h-full w-full "
        >
          <h1 className="mt-5">ВХОД</h1>
          <div>
            <input
              className="focus:outline-none  w-full p-3"
              type="email"
              name="email"
              placeholder="email"
            />
            <input
              className=" focus:outline-none  mt-2 w-full p-3"
              type="password"
              name="password"
              placeholder="password"
            />
          </div>
          <div className="flex flex-col w-full items-center mb-5">
            <button className="p-3 mt-3 w-full" type="submit">
              Логин
            </button>
            {error ? (
              <span className="text-red-600">Неверная почта или пароль</span>
            ) : null}
            <a className=" text-blue-500 underline" href="/registration">
              Регистрация
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
