import { NavLink } from "react-router-dom";
import Logo from "./Logo";
import { User, ArrowUpRight } from "lucide-react";
import "./styles/navbar.css";

function Navbar() {
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
                </nav>

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