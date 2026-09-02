import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import "./login.css";

function Login() {
  const [usuario, setUsuario] = useState("");
  const [senha, setSenha] = useState("");
  const [mostrarSenha, setMostrarSenha] = useState(false);
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

          <div className="login-senha-wrapper">
            <input
              className="login-input login-senha-input"
              type={mostrarSenha ? "text" : "password"}
              placeholder="Senha"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
            <button
              className="login-senha-toggle"
              type="button"
              onClick={() => setMostrarSenha((visivel) => !visivel)}
              aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"}
              aria-pressed={mostrarSenha}
            >
              {mostrarSenha ? "Ocultar" : "Mostrar"}
            </button>
          </div>

          {/* Mensagem de erro — renderização condicional com && */}
          {erro && <p className="login-erro">{erro}</p>}

          <button className="login-btn" onClick={handleLogin}>
            Entrar
          </button>

          <p className="login-aviso">
            Insira as credenciais para acessar o Dashboard :) <br />
          </p>
        </div>
      </div>

      {/* Conteúdo direito — vazio ou decorativo */}
      <div className="login-content"></div>
    </div>
  );
}

export default Login;
