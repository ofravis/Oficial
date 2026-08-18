import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/authcontext";
import "./login.css";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [shake, setShake] = useState(false);
  const { login } = useAuth();

  const navigate = useNavigate();

  async function handleLogin() {
    if (usuario === "admin" && senha === "1234") {
      await login(); // aguarda o login ser concluído
      navigate("/"); // redireciona — chamado APÓS a ação
      return;
    }
    // Credenciais erradas → exibe mensagem de erro
    setErro("Usuário ou senha incorretos");
    setShake(true);
    setTimeout(() => setErro(""), 3000);
    setTimeout(() => setShake(false), 800); // Remove a classe após a animação
  }

  return (
    <div className="login-container">
      {/* Sidebar esquerda com formulário */}
      <div className="login-sidebar">
        <div className={`login-card ${shake ? "shake" : ""}`}>
          <h1 className="login-logo">TaskFlow </h1>
          <p className="login-subtitulo">Faça login para continuar</p>

          {/* Input de usuário — estado controlado */}
          <input
            className="login-input"
            type="text"
            placeholder="Usuário"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
          />

          <input
            className="login-input"
            type="password"
            placeholder="Senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />

          {/* Mensagem de erro — renderização condicional com && */}
          {erro && <p className="login-erro">{erro}</p>}

          <button className="login-btn" onClick={handleLogin}>
            Entrar
          </button>

          <p className="login-aviso">
            Este login é apenas para fins didáticos. Credenciais reais vêm no
            módulo back-end.
          </p>
        </div>
      </div>

      {/* Conteúdo direito — vazio ou decorativo */}
      <div className="login-content"></div>
    </div>
  );
}

export default Login;
