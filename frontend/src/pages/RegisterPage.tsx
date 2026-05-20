import "./styles/register-page.css";
import Logo from "../components/Logo";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async () => {
        try {
            setError("");

            if (!name.trim() || !email.trim() || !password.trim()) {
                setError("Name, email and password are required.");
                return;
            }

            if (password.length < 6) {
                setError("Password must have at least 6 characters.");
                return;
            }

            if (password !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }

            await register(name, email, password);

            navigate("/events-table");
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Failed to register.");
            }
        }
    };

    return (
        <div className="page page-register">
            <div className="register-layout">
                <div className="register-branding">
                    <Logo width={320} />
                    <h2 className="tagline">
                        Discover what's happening around you.
                    </h2>
                </div>

                <div className="register-card">
                    <h3 className="register-title">Create new account</h3>

                    <p className="register-subtitle">
                        Join Happening and start exploring local events.
                    </p>

                    {error && <p className="register-error">{error}</p>}

                    <label htmlFor="name" className="input-label">
                        Name
                    </label>
                    <input
                        id="name"
                        type="text"
                        className="input-field"
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                    />

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

                    <label htmlFor="confirmPassword" className="input-label">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        className="input-field"
                        value={confirmPassword}
                        onChange={(event) => setConfirmPassword(event.target.value)}
                    />

                    <button
                        type="button"
                        className="register-button primary-button"
                        onClick={handleRegister}
                    >
                        Create Account
                    </button>

                    <p className="footer-text">
                        Already have an account?
                        <br />
                        <span
                            className="footer-link"
                            onClick={() => navigate("/login")}
                        >
                            Login
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RegisterPage;