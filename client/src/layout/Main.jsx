import React, { useContext } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import "../App.css";
import Footer from "../components/Footer";
import { AuthContext } from "../authContexts/AuthProvider";
import LaodingSpinner from "../components/LaodingSpinner";
const Main = () => {
  const { loading } = useContext(AuthContext);
  return (
    <div>
      <Navbar />
      <div className="min-h-screen">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
};

export default Main;

// {loading ? (
//   <LaodingSpinner />
// ) : (
//   <div>
//     {" "}
//     <Navbar />
//     <div className="min-h-screen">
//       <Outlet />
//     </div>
//     <Footer />
//   </div>
// )}
