import "./styles/login-page.css";
import Logo from "../components/Logo";
import { useNavigate } from "react-router-dom";
import {
    getPreferredView,
    incrementVisitCount,
    saveLastVisit,
} from "../utils/cookies";

function LoginPage() {
    const navigate = useNavigate();

    const handleLogin = () => {
        incrementVisitCount();
        saveLastVisit();
        const view = getPreferredView();
        navigate(view === "table" ? "/events-table" : "/events-cards-view");
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

                    <label htmlFor="email" className="input-label">
                        Email
                    </label>
                    <input id="email" type="email" className="input-field" />

                    <label htmlFor="password" className="input-label">
                        Password
                    </label>
                    <input id="password" type="password" className="input-field" />

                    <button className="primary-button login-button" onClick={handleLogin}>
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