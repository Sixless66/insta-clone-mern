import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const PrivateRoute = ({ children }) => {
  const { token } = useContext(UserContext);

  return token ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
