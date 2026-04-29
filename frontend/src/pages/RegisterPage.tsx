import "./styles/register-page.css";
import Logo from "../components/Logo";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
    const navigate = useNavigate();

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

                    <label htmlFor="name" className="input-label">
                        Name
                    </label>
                    <input id="name" type="text" className="input-field" />

                    <label htmlFor="email" className="input-label">
                        Email
                    </label>
                    <input id="email" type="email" className="input-field" />

                    <label htmlFor="password" className="input-label">
                        Password
                    </label>
                    <input id="password" type="password" className="input-field" />

                    <label htmlFor="confirmPassword" className="input-label">
                        Confirm Password
                    </label>
                    <input
                        id="confirmPassword"
                        type="password"
                        className="input-field"
                    />

                    <button
                        className="register-button primary-button"
                        onClick={() => navigate("/login")}
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