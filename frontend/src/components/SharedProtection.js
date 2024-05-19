import { Navigate } from "react-router-dom";
import { useAppContext } from "../context/appContext";
import Loading from "./Loading";

export const SharedProtection = ({ children, role }) => {
  const { user, userLoading } = useAppContext();

  console.log(user);
  console.log(userLoading);

  if (userLoading) return <Loading />;
  if (!user) {
    return <Navigate to="/" />;
  }
  return children;
};
