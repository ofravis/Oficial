import { NavLink, useNavigate } from "react-router";
import styles from "./sidebar.module.css";
import { useAuth } from "../contexts/AuthContext";

function Sidebar() {
  const { logado, logout } = useAuth();
  const navigate = useNavigate();

  // NavLink recebe função em className — isActive vem do Router
  const linkClass = ({ isActive }) =>
    isActive ? styles.link + " " + styles.ativo : styles.link;

  // Sair: desloga e garante o redirecionamento para /login
  // (necessário mesmo em rotas públicas, como /sobre)
  function handleSair() {
    logout();
    navigate("/login");
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <h1>TaskFlow</h1>
      </div>
      <nav className={styles.nav}>
        {logado && (
          <NavLink to="/" className={linkClass}>
            Dashboard
          </NavLink>
        )}
        <NavLink to="/sobre" className={linkClass}>
          Sobre
        </NavLink>
      </nav>
      {logado && (
        <button className={styles["btn-sair"]} onClick={handleSair}>
          Sair
        </button>
      )}
    </aside>
  );
}
export default Sidebar;
