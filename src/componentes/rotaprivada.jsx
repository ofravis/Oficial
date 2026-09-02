import { Navigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";

function RotaPrivada({ children }) {
  const { logado } = useAuth();
  if (!logado) {
    return <Navigate to="/login" replace={true} />;
  }
  return children;
}
export default RotaPrivada;
