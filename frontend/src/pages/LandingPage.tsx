import "./styles/landing-page.css";
import { useNavigate } from "react-router-dom";
import Logo from "../components/Logo";

function LandingPage() {
    const navigate = useNavigate();

    return (
        <div className="page page-landing">
            <div className="landing-hero">
                <div className="landing-content">
                    <div className="landing-logo-wrap">
                        <Logo width={360} />
                    </div>

                    <h1 className="landing-heading">
                        Discover what’s happening
                        <br />
                        around you
                    </h1>

                    <p className="landing-description">
                        Happening helps users discover local events such as concerts,
                        workshops, exhibitions, and social gatherings. Browse events,
                        save favorites, and never miss what’s happening nearby.
                    </p>

                    <div className="landing-actions">
                        <button
                            className="primary-button landing-primary-button"
                            onClick={() => navigate("/login")}
                        >
                            Get Started
                        </button>

                        <button
                            className="secondary-button"
                            onClick={() => navigate("/register")}
                        >
                            Create Account
                        </button>
                    </div>

                    <div className="landing-features">
                        <span className="feature-pill">Concerts</span>
                        <span className="feature-pill">Workshops</span>
                        <span className="feature-pill">Exhibitions</span>
                        <span className="feature-pill">Favorites</span>
                    </div>
                </div>

                <div className="landing-visual">
                    <div className="visual-card visual-main-card">
                        <div className="visual-card-header">Upcoming Events</div>

                        <div className="visual-event">
                            <div>
                                <h4>Jazz in the Park</h4>
                                <p>21 May 2026 · Central Park</p>
                            </div>
                            <span className="event-tag">Music</span>
                        </div>

                        <div className="visual-event">
                            <div>
                                <h4>Art Expo</h4>
                                <p>27 May 2026 · Art Museum</p>
                            </div>
                            <span className="event-tag">Exhibition</span>
                        </div>

                        <div className="visual-event">
                            <div>
                                <h4>Startup Pitch Night</h4>
                                <p>15 Jul 2026 · Tech Hub</p>
                            </div>
                            <span className="event-tag">Business</span>
                        </div>
                    </div>

                    <div className="visual-card visual-floating-card top-card">
                        <p className="mini-label">Saved</p>
                        <h4>12 favorite events</h4>
                    </div>

                    <div className="visual-card visual-floating-card bottom-card">
                        <p className="mini-label">This week</p>
                        <h4>8 new events near you</h4>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LandingPage;