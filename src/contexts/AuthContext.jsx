import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

function getAuthData() {
  async function getUser() {
    const response = await fetch("https://randomuser.me/api/");
    const data = await response.json();
    return data.results[0];
  }

  return { getUser };
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [logado, setLogado] = useState(false);
  const [loading, setLoading] = useState(false);

  const login = async () => {
    try {
      setLoading(true);
      const userData = await Promise.race([
        getAuthData().getUser(),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 5000),
        ),
      ]);
      setUser(userData);
      setLogado(true);
    } catch (error) {
      console.error("Erro ao fazer login:", error);
      setLogado(true);
      setUser({ name: { first: "Usuário", last: "Local" } });
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setLogado(false);
  };

  const value = {
    user,
    logado,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={{ user, logado, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider");
  }
  return context;
}
