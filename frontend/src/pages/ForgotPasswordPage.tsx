import "./styles/forgot-password-page.css";
import Logo from "../components/Logo";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import {
    forgotPasswordRequest,
    resetPasswordRequest,
} from "../services/authApi";

function ForgotPasswordPage() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [isResetStep, setIsResetStep] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleRequestReset = async () => {
        try {
            setError("");
            setMessage("");

            if (!email.trim()) {
                setError("Email is required.");
                return;
            }

            const response = await forgotPasswordRequest(email);

            setMessage(response.message);
            setIsResetStep(true);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Failed to request password reset.");
            }
        }
    };

    const handleResetPassword = async () => {
        try {
            setError("");
            setMessage("");

            if (!code.trim() || !newPassword.trim() || !confirmPassword.trim()) {
                setError("Code, new password and confirm password are required.");
                return;
            }

            if (newPassword.length < 6) {
                setError("Password must have at least 6 characters.");
                return;
            }

            if (newPassword !== confirmPassword) {
                setError("Passwords do not match.");
                return;
            }

            const response = await resetPasswordRequest(
                email,
                code,
                newPassword
            );

            setMessage(response.message);

            setTimeout(() => {
                navigate("/login");
            }, 1200);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Failed to reset password.");
            }
        }
    };

    return (
        <div className="page page-forgot-password">
            <div className="forgot-password-layout">
                <div className="forgot-password-branding">
                    <Logo width={320} />
                    <h2 className="tagline">
                        Discover what's happening around you.
                    </h2>
                </div>

                <div className="forgot-password-card">
                    <h3 className="forgot-password-title">
                        {isResetStep ? "Reset your password" : "Recover account"}
                    </h3>

                    <p className="forgot-password-subtitle">
                        {isResetStep
                            ? "Enter the code from your email and choose a new password."
                            : "Enter your email and we will send you a reset code."}
                    </p>

                    {message && (
                        <p className="forgot-password-message">{message}</p>
                    )}
                    {error && <p className="forgot-password-error">{error}</p>}

                    {!isResetStep ? (
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

                            <button
                                type="button"
                                className="primary-button forgot-password-button"
                                onClick={handleRequestReset}
                            >
                                Send reset code
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="forgot-password-code-box">
                                <span>Reset code sent to</span>
                                <strong>{email}</strong>
                            </div>

                            <label htmlFor="code" className="input-label">
                                Reset Code
                            </label>
                            <input
                                id="code"
                                type="text"
                                className="input-field"
                                value={code}
                                onChange={(event) => setCode(event.target.value)}
                                maxLength={6}
                            />

                            <label htmlFor="newPassword" className="input-label">
                                New Password
                            </label>
                            <input
                                id="newPassword"
                                type="password"
                                className="input-field"
                                value={newPassword}
                                onChange={(event) =>
                                    setNewPassword(event.target.value)
                                }
                            />

                            <label
                                htmlFor="confirmPassword"
                                className="input-label"
                            >
                                Confirm New Password
                            </label>
                            <input
                                id="confirmPassword"
                                type="password"
                                className="input-field"
                                value={confirmPassword}
                                onChange={(event) =>
                                    setConfirmPassword(event.target.value)
                                }
                            />

                            <button
                                type="button"
                                className="forgot-password-button primary-button"
                                onClick={handleResetPassword}
                            >
                                Reset password
                            </button>
                        </>
                    )}

                    <p className="footer-text">
                        Remember your password?
                        <br />
                        <span
                            className="footer-link"
                            onClick={() => navigate("/login")}
                        >
                            Back to login
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default ForgotPasswordPage;