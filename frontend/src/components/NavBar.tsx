import { NavLink, useNavigate } from "react-router-dom";
import Logo from "./Logo";
import { User, ArrowUpRight, LogOut } from "lucide-react";
import "./styles/navbar.css";
import { useAuth } from "../context/AuthContext";
import RequirePermission from "./RequirePermission";

function Navbar() {
    const { currentUser, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <header className="navbar">
            <div className="navbar-inner">
                <div className="navbar-left">
                    <NavLink to="/landing-page" className="navbar-logo-link">
                        <Logo width={170} />
                    </NavLink>
                </div>

                <nav className="navbar-center">
                    <NavLink
                        to="/events-table"
                        className={({ isActive }) =>
                            `navbar-link ${isActive ? "active-link" : ""}`
                        }
                    >
                        <span className="navbar-link-icon">
                            <ArrowUpRight size={16} strokeWidth={2} />
                        </span>
                        <span className="text-link">Events</span>
                    </NavLink>

                    <NavLink
                        to="/statistics-page"
                        className={({ isActive }) =>
                            `navbar-link ${isActive ? "active-link" : ""}`
                        }
                    >
                        <span className="navbar-link-icon">
                            <ArrowUpRight size={16} strokeWidth={2} />
                        </span>
                        <span className="text-link">Statistics</span>
                    </NavLink>

                    <NavLink
                        to="/favorites-page"
                        className={({ isActive }) =>
                            `navbar-link ${isActive ? "active-link" : ""}`
                        }
                    >
                        <span className="navbar-link-icon">
                            <ArrowUpRight size={16} strokeWidth={2} />
                        </span>
                        <span className="text-link">Favorites</span>
                    </NavLink>

                    <NavLink
                        to="/chat"
                        className={({ isActive }) =>
                            `navbar-link ${isActive ? "active-link" : ""}`
                        }
                    >
                        <span className="navbar-link-icon">
                            <ArrowUpRight size={16} strokeWidth={2} />
                        </span>
                        <span className="text-link">Chat</span>
                    </NavLink>

                    <RequirePermission permission="suspicious-users:read">
                        <NavLink
                            to="/observation-list"
                            className={({ isActive }) =>
                                `navbar-link ${isActive ? "active-link" : ""}`
                            }
                        >
                            <span className="navbar-link-icon">
                                <ArrowUpRight size={16} strokeWidth={2} />
                            </span>
                            <span className="text-link">Observation</span>
                        </NavLink>
                    </RequirePermission>
                </nav>
                
                {currentUser && (
                    <div className="navbar-user-box">
                        <div className="navbar-user-info">
                            <span className="navbar-user-name">{currentUser.name}</span>
                            <span className="navbar-user-role">
                                {currentUser.roles.join(", ")}
                            </span>
                        </div>

                        <button
                            type="button"
                            className="navbar-logout-button"
                            onClick={handleLogout}
                            title="Logout"
                        >
                            <LogOut size={18} />
                        </button>
                    </div>
                )}

                <div className="navbar-right">
                    <NavLink to="/profile" className="navbar-profile">
                        <User size={22} strokeWidth={2} />
                    </NavLink>
                </div>
            </div>
        </header>
    );
}

export default Navbar;