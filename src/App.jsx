import { Route, Routes, useLocation } from "react-router";
import "./app.css";
import Kanban from "./pages/kanban";
import Sobre from "./pages/sobre";
import Login from "./pages/login";
import Sidebar from "./componentes/sidebar";
import RotaPrivada from "./componentes/rotaprivada";

function App() {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="app-layout">
      {/* Sidebar aparece apenas fora da página de login */}
      {!isLoginPage && <Sidebar />}

      {/* Conteúdo principal — muda conforme a URL */}
      <main className="app-conteudo">
        <Routes>
          <Route
            path="/"
            element={
              <RotaPrivada>
                <Kanban />
              </RotaPrivada>
            }
          />
          {/* Rota pública — acessível sem login */}
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<h1>Página não encontrada</h1>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
