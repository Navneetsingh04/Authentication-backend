import React, { useContext } from "react";
import { useForm } from "react-hook-form";
import { axiosInstance } from "../lib/axios";
import { toast } from "react-hot-toast";
import { Context } from "../main";
import { Link, useNavigate } from "react-router";

const Login = () => {
  const { setIsAuthenticated, setUser } = useContext(Context);
  const navigateTo = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const handleLogin = async (data) => {
    await axiosInstance
      .post("/user/login", data)
      .then((res) => {
        toast.success(res.data.message);
        setIsAuthenticated(true);
        setUser(res.data.user);
        navigateTo("/");
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Login failed. Please try again.");
      });
  };
  return (
    <>
      <form
        className="auth-form"
        onSubmit={handleSubmit((data) => handleLogin(data))}
      >
        <h2>Login</h2>
        <input
          type="email"
          placeholder="Email"
          required
          {...register("email")}
        />
        <input
          type="password"
          placeholder="Password"
          required
          {...register("password")}
        />
        <p className="forgot-password">
          <Link to={"/password/forgot"}>Forgot your password?</Link>
        </p>
        <button type="submit">Login</button>
      </form>
    </>
  );
};

export default Login;
