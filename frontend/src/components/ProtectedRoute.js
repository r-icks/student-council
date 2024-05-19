import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import Loading from "./Loading";

export const ProtectedRoute = ({ children, role }) => {
  const { user, userLoading, userRole } = useAppContext();

  console.log({ user });
  console.log({ userRole });

  if (userLoading) return <Loading />;
  if (!user || userRole !== role) {
    return <Navigate to="/" />;
  }
  return children;
};
