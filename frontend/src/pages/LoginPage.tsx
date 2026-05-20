import "./styles/login-page.css";
import Logo from "../components/Logo";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    getPreferredView,
    incrementVisitCount,
    saveLastVisit,
} from "../utils/cookies";
import { useAuth } from "../context/AuthContext";

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("admin@test.com");
    const [password, setPassword] = useState("admin123");
    const [error, setError] = useState("");

    const handleLogin = async () => {
        try {
            setError("");

            await login(email, password);

            incrementVisitCount();
            saveLastVisit();

            const view = getPreferredView();
            navigate(view === "table" ? "/events-table" : "/events-cards-view");
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Failed to login.");
            }
        }
    };

    return (
        <div className="page page-login">
            <div className="login-layout">
                <div className="login-branding">
                    <Logo width={320} />
                    <h2 className="tagline">Discover what's happening around you.</h2>
                </div>

                <div className="login-card">
                    <h3 className="login-title">Log in to your account</h3>

                    {error && <p className="login-error">{error}</p>}

                    <label htmlFor="email" className="input-label">
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        className="input-field"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />

                    <label htmlFor="password" className="input-label">
                        Password
                    </label>
                    <input
                        id="password"
                        type="password"
                        className="input-field"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />

                    <button
                        className="primary-button login-button"
                        onClick={handleLogin}
                        type="button"
                    >
                        Login
                    </button>

                    <p className="footer-text">
                        Don't have an account?
                        <br />
                        <span
                            className="footer-link"
                            onClick={() => navigate("/register")}
                        >
                            Register
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default LoginPage;