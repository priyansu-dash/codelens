import { useState } from "react";
import api from "../lib/api";

export default function AuthPage({ onLogin }) {
    const [mode, setMode] = useState("login"); // "login" | "signup"
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const endpoint = mode === "login" ? "/api/auth/login" : "/api/auth/signup";
            const { data } = await api.post(endpoint, { email, password });
            onLogin(data.token);
        } catch (err) {
            setError(err.response?.data?.error || "Something went wrong.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-root">
            <div className="auth-card">
                {/* Logo / wordmark */}
                <div className="auth-logo">
                    <span className="auth-logo-icon">{"</>"}</span>
                    <span className="auth-logo-name">CodeLens</span>
                </div>

                <p className="auth-tagline">
                    {mode === "login" ? "Sign in to your workspace" : "Create your workspace"}
                </p>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="field-group">
                        <label htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="you@example.com"
                        />
                    </div>

                    <div className="field-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            autoComplete={mode === "login" ? "current-password" : "new-password"}
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                        />
                    </div>

                    {error && <p className="auth-error">{error}</p>}

                    <button type="submit" className="btn-primary" disabled={loading}>
                        {loading ? "Please wait…" : mode === "login" ? "Sign in" : "Create account"}
                    </button>
                </form>

                <p className="auth-switch">
                    {mode === "login" ? "No account?" : "Already have an account?"}{" "}
                    <button
                        type="button"
                        className="link-btn"
                        onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
                    >
                        {mode === "login" ? "Sign up" : "Sign in"}
                    </button>
                </p>
            </div>
        </div>
    );
}