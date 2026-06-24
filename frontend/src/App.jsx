import { useState, useEffect } from "react";
import AuthPage from "./pages/AuthPage";
import AppPage from "./pages/AppPage";

export default function App() {
  const [token, setToken] = useState(() => localStorage.getItem("token"));

  useEffect(() => {
    if (token) localStorage.setItem("token", token);
    else localStorage.removeItem("token");
  }, [token]);

  const handleLogin = (newToken) => setToken(newToken);
  const handleLogout = () => setToken(null);

  if (!token) return <AuthPage onLogin={handleLogin} />;
  return <AppPage onLogout={handleLogout} />;
}