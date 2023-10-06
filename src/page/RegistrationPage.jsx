import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useMutation } from "react-query";
import { Registration } from "../api";

const RegistrationPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const mutation = useMutation((data) => Registration(data), { onSuccess: () =>  navigate("/login")});
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

  const handleRegistration = async (event) => {
    event.preventDefault();
    try {
      const formData = new FormData(event.target);
      const fields = Object.fromEntries(formData);
      await mutation.mutateAsync(fields);
    } catch (error) {
      console.error(error);
      setError(true);
    }
  };

  return (
    <div className="flex items-center justify-center h-[100%]">
      <form
        onSubmit={handleRegistration}
        className=" px-10 flex flex-col justify-between items-center  h-[400px] w-[400px]"
      >
        <h1 className="mt-5">РЕГИСТРАЦИЯ</h1>
        <div className="">
          <input
            className="focus:outline-none  w-full p-3"
            type="email"
            name="email"
            placeholder="email"
          />
          <input
            className=" focus:outline-none mt-2 w-full p-3"
            type="password"
            name="password"
            placeholder="password"
          />
        </div>
        <div className="flex flex-col w-full items-center mb-5">
          <button className="mt-3 p-3 w-full" type="submit">
            Регистрация
          </button>
          {error ? (
            <span className="text-red-600">Неверная почта или пароль</span>
          ) : null}
          <a className=" text-blue-500 underline" href="/login">
            Логин
          </a>
        </div>
      </form>
    </div>
  );
};

export default RegistrationPage;
