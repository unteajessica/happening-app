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
    const { login, verifyLogin } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [verificationCode, setVerificationCode] = useState("");
    const [isVerificationStep, setIsVerificationStep] = useState(false);
    const [pendingEmail, setPendingEmail] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const goToPreferredView = () => {
        incrementVisitCount();
        saveLastVisit();

        const view = getPreferredView();
        navigate(view === "table" ? "/events-table" : "/events-cards-view");
    };

    const handleLogin = async () => {
        try {
            setError("");
            setMessage("");

            if (!email.trim() || !password.trim()) {
                setError("Email and password are required.");
                return;
            }

            await login(email, password);

            setPendingEmail(email.trim().toLowerCase());
            setIsVerificationStep(true);
            setMessage("A verification code was sent to your email.");
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Failed to login.");
            }
        }
    };

    const handleVerifyCode = async () => {
        try {
            setError("");
            setMessage("");

            if (!verificationCode.trim()) {
                setError("Verification code is required.");
                return;
            }

            await verifyLogin(pendingEmail, verificationCode);

            goToPreferredView();
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Failed to verify login.");
            }
        }
    };

    const handleBackToLogin = () => {
        setIsVerificationStep(false);
        setVerificationCode("");
        setMessage("");
        setError("");
    };

    return (
        <div className="page page-login">
            <div className="login-layout">
                <div className="login-branding">
                    <Logo width={320} />
                    <h2 className="tagline">
                        Discover what's happening around you.
                    </h2>
                </div>

                <div className="login-card">
                    <h3 className="login-title">
                        {isVerificationStep
                            ? "Verify your login"
                            : "Log in to your account"}
                    </h3>

                    {message && <p className="login-message">{message}</p>}
                    {error && <p className="login-error">{error}</p>}

                    {!isVerificationStep ? (
                        <>
                            <label htmlFor="email" className="input-label">
                                Email
                            </label>
                            <input
                                id="email"
                                type="email"
                                className="input-field"
                                value={email}
                                onChange={(event) =>
                                    setEmail(event.target.value)
                                }
                            />

                            <label htmlFor="password" className="input-label">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                className="input-field"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                            />

                            <button
                                className="primary-button login-button"
                                onClick={handleLogin}
                            >
                                Send verification code
                            </button>

                            <p className="footer-text">
                                <span
                                    className="footer-link"
                                    onClick={() => navigate("/forgot-password")}
                                >
                                    Forgot password?
                                </span>
                            </p>

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
                        </>
                    ) : (
                        <>
                            <p className="footer-text">
                                Code sent to:
                                <br />
                                <strong>{pendingEmail}</strong>
                            </p>

                            <label
                                htmlFor="verificationCode"
                                className="input-label"
                            >
                                Verification Code
                            </label>
                            <input
                                id="verificationCode"
                                type="text"
                                className="input-field"
                                value={verificationCode}
                                onChange={(event) =>
                                    setVerificationCode(event.target.value)
                                }
                                maxLength={6}
                            />

                            <button
                                className="primary-button login-button"
                                onClick={handleVerifyCode}
                            >
                                Verify and Login
                            </button>

                            <p className="footer-text">
                                Didn't receive a code?
                                <br />
                                <span
                                    className="footer-link"
                                    onClick={handleLogin}
                                >
                                    Send again
                                </span>
                                {" · "}
                                <span
                                    className="footer-link"
                                    onClick={handleBackToLogin}
                                >
                                    Change email
                                </span>
                            </p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LoginPage;