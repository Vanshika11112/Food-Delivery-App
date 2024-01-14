import React, { useContext } from "react";
import { AuthContext } from "../authContexts/AuthProvider";
import { Navigate, useLocation } from "react-router-dom";
import LaodingSpinner from "../components/LaodingSpinner";

const PrivateRouter = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <LaodingSpinner />;
  }
  if (user) {
    return children;
  }
  return <Navigate to="/login" state={{ from: location }} replace></Navigate>;
};

export default PrivateRouter;
