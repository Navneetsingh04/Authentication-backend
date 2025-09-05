import React, { useContext } from "react";
import Hero from "../components/Hero";
import Developer from "../components/Developer";
import Technologies from "../components/Technologies";
import "../styles/Home.css";
import { toast } from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { Context } from "../main";
import { Navigate, useNavigate } from "react-router";
import Footer from "../layout/Footer";

const Home = () => {
  const { isAuthenticated, setIsAuthenticated, setUser } = useContext(Context);

  const logout = async () => {
    await axiosInstance
      .post("/user/logout", {
        withCredentials: true,
      })
      .then((res) => {
        toast.success(res.data.message);
        setUser(null);
        setIsAuthenticated(false);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
        console.error(err);
      });
  };

  if (!isAuthenticated) {
    return <Navigate to={"/auth"} />;
  }

  return (
    <>
      <section className="home">
        <Hero />
        <Developer />
        <Technologies />
        <Footer />
        <button onClick={logout}>Logout</button>
      </section>
    </>
  );
};

export default Home;
