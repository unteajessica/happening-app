import "./styles/favorites-page.css";
import Navbar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../context/EventsContext";
import { useState } from "react";
import EventCard from "../components/EventCard";
import { Heart, Sparkles } from "lucide-react";
import SectionPageLayout from "../components/SectionPageLayout";
import InsightCard from "../components/InsightCard";

function FavoritesPage() {
    const [currentPage, setCurrentPage] = useState(1);
    const eventsPerPage = 6;

    const navigate = useNavigate();
    const { newEvents, favorites } = useEvents();

    const favoriteEvents = newEvents.filter((e) => favorites.includes(e.id));

    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = favoriteEvents.slice(indexOfFirstEvent, indexOfLastEvent);
    const totalPages = Math.ceil(favoriteEvents.length / eventsPerPage);

    const freeFavoritesCount = favoriteEvents.filter(
        (event) => event.price === "Free"
    ).length;

    const paidFavoritesCount = favoriteEvents.length - freeFavoritesCount;

    const today = new Date();
    const todayFormatted = `${String(today.getDate()).padStart(2, "0")}-${String(
        today.getMonth() + 1
    ).padStart(2, "0")}-${today.getFullYear()}`;

    const todayEventsCount = favoriteEvents.filter(
        (event) => event.date === todayFormatted
    ).length;

    return (
        <div className="app-shell">
            <Navbar />

            <SectionPageLayout
                pageClassName="favorites-page"
                eyebrow="Saved Collection"
                title="Favorites"
                description="Browse the events you're interested in and choose those you want to attend."
                actions={
                    <button
                        className="favorites-random-button"
                        onClick={() => navigate("/pick-your-night")}
                        type="button"
                    >
                        <Sparkles size={16} />
                        Pick Your Night
                    </button>
                }
                insights={
                    <>
                        <InsightCard label="Saved" value={favoriteEvents.length} />
                        <InsightCard label="Free" value={freeFavoritesCount} />
                        <InsightCard label="Paid" value={paidFavoritesCount} />
                        <InsightCard label="Today" value={todayEventsCount} />
                    </>
                }
            >
                {favoriteEvents.length === 0 ? (
                    <section className="favorites-empty-state">
                        <div className="favorites-empty-icon">
                            <Heart size={24} />
                        </div>

                        <p className="favorites-empty-kicker">Nothing saved yet</p>
                        <h2 className="favorites-empty-title">
                            Start building your favorites
                        </h2>
                        <p className="favorites-empty-text">
                            Tap the heart on any event to keep it here and create your own
                            personal shortlist.
                        </p>

                        <button
                            type="button"
                            className="favorites-empty-button"
                            onClick={() => navigate("/events-cards-view")}
                        >
                            Explore events
                        </button>
                    </section>
                ) : (
                    <section className="favorites-panel">
                        <div className="favorites-panel-header">
                            <div>
                                <p className="favorites-panel-kicker">Collection</p>
                                <h2 className="favorites-panel-title">Saved Events</h2>
                            </div>

                            <p className="favorites-panel-meta">
                                Showing {indexOfFirstEvent + 1}–
                                {Math.min(indexOfLastEvent, favoriteEvents.length)} of{" "}
                                {favoriteEvents.length}
                            </p>
                        </div>

                        <section className="cards-grid-container">
                            {currentEvents.map((event) => (
                                <EventCard
                                    key={event.id}
                                    event={event}
                                    onView={() => navigate(`/event-details/${event.id}`)}
                                />
                            ))}
                        </section>

                        <div className="pagination">
                            <span
                                onClick={() =>
                                    currentPage > 1 && setCurrentPage(currentPage - 1)
                                }
                                className={`pagination-arrow ${
                                    currentPage === 1 ? "disabled-page" : ""
                                }`}
                            >
                                &lt; Previous
                            </span>

                            <div className="pagination-numbers">
                                {[...Array(totalPages)].map((_, index) => (
                                    <span
                                        key={index}
                                        className={`page-number ${
                                            currentPage === index + 1 ? "active-page" : ""
                                        }`}
                                        onClick={() => setCurrentPage(index + 1)}
                                    >
                                        {index + 1}
                                    </span>
                                ))}
                            </div>

                            <span
                                onClick={() =>
                                    currentPage < totalPages &&
                                    setCurrentPage(currentPage + 1)
                                }
                                className={`pagination-arrow ${
                                    currentPage === totalPages ? "disabled-page" : ""
                                }`}
                            >
                                Next &gt;
                            </span>
                        </div>
                    </section>
                )}
            </SectionPageLayout>
        </div>
    );
}

export default FavoritesPage;