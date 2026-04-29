import "./styles/events-table-page.css";
import Navbar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../context/EventsContext";
import { useState, useEffect } from "react";
import type { EventItem } from "../types/event";
import { savePreferredView, saveLastPage, getLastPage } from "../utils/cookies";
import SectionPageLayout from "../components/SectionPageLayout";
import InsightCard from "../components/InsightCard";
import { API_MODE } from "../services/eventsApi";

function EventsTablePage() {
    const [currentPage, setCurrentPage] = useState(getLastPage());
    const eventsPerPage = 6;

    const navigate = useNavigate();
    const { newEvents, deleteEvent, favorites, toggleFavorite, isOnline } = useEvents();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

    const formatMobileDate = (dateString: string) => {
        const [day, month] = dateString.split("-");
        return `${day}/${month}`;
    };

    const handleOpenDeleteModal = (event: EventItem) => {
        setSelectedEvent(event);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setSelectedEvent(null);
        setShowDeleteModal(false);
    };

    const handleConfirmDelete = () => {
        if (!selectedEvent) return;

        deleteEvent(selectedEvent.id);
        setShowDeleteModal(false);
        setSelectedEvent(null);
    };

    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = newEvents.slice(indexOfFirstEvent, indexOfLastEvent);

    const totalPages = Math.ceil(newEvents.length / eventsPerPage);

    const freeEventsCount = newEvents.filter((event) => event.price === "Free").length;
    const paidEventsCount = newEvents.length - freeEventsCount;

    useEffect(() => {
        savePreferredView("table");
    }, []);

    useEffect(() => {
        saveLastPage(currentPage);
    }, [currentPage]);

    return (
        <div className="app-shell page events-page-shell">
            <Navbar />

            <SectionPageLayout
                pageClassName="events-page"
                eyebrow="Curated Events"
                title="Events"
                description="Browse upcoming events, manage your listings, and keep track of the experiences your users can discover."
                actions={
                    <>
                        <button
                            className="toggle-views-button"
                            onClick={() => navigate("/events-cards-view")}
                            aria-label="Switch View"
                            type="button"
                        >
                            Switch to Cards View
                        </button>

                        <button
                            className="add-event-button"
                            onClick={() => navigate("/add-event")}
                            aria-label="Add event"
                            type="button"
                        >
                            +
                        </button>
                    </>
                }
                insights={
                    <>
                        <InsightCard label="Total" value={newEvents.length} />
                        <InsightCard label="Free" value={freeEventsCount} />
                        <InsightCard label="Paid" value={paidEventsCount} />
                        <InsightCard label="Favorites" value={favorites.length} />
                    </>
                }
            >
                <section className="events-panel">
                    <div className="events-panel-header">
                        <div>
                            <p className="panel-kicker">Collection</p>
                            <h2 className="panel-title">Upcoming Events</h2>
                            <p>{isOnline ? "Online" : "Offline"}</p>
                            <p style={{ marginTop: "8px", color: "#8c7e73" }}>
                                API mode: <strong>{API_MODE.toUpperCase()}</strong>
                            </p>
                        </div>

                        <p className="panel-meta">
                            Showing {indexOfFirstEvent + 1}–
                            {Math.min(indexOfLastEvent, newEvents.length)} of {newEvents.length}
                        </p>
                    </div>

                    <div className="events-table-wrapper">
                        <table className="events-table">
                            <thead>
                                <tr>
                                    <th>Event</th>
                                    <th>Category</th>
                                    <th>Date</th>
                                    <th>Location</th>
                                    <th>Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {currentEvents.map((event) => (
                                    <tr key={event.id}>
                                        <td className="event-title-cell">{event.title}</td>
                                        <td>{event.category}</td>
                                        <td>
                                            <span className="desktop-date">{event.date}</span>
                                            <span className="mobile-date">
                                                {formatMobileDate(event.date)}
                                            </span>
                                        </td>
                                        <td>{event.location}</td>
                                        <td>{event.price}</td>
                                        <td className="actions-cell">
                                            <button
                                                type="button"
                                                className="action-button view-button"
                                                onClick={() => navigate(`/event-details/${event.id}`)}
                                            >
                                                View
                                            </button>

                                            <button
                                                type="button"
                                                className="action-button table-edit-button mobile-hide-action"
                                                onClick={() => navigate(`/edit-event/${event.id}`)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                type="button"
                                                className="action-button delete-button mobile-hide-action"
                                                onClick={() => handleOpenDeleteModal(event)}
                                            >
                                                Delete
                                            </button>

                                            <button
                                                className="heart-button"
                                                onClick={() => toggleFavorite(event.id)}
                                                aria-label="Toggle favorite"
                                                type="button"
                                            >
                                                {favorites.includes(event.id) ? "♥" : "♡"}
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="pagination">
                        <span
                            onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
                            className={`pagination-arrow ${currentPage === 1 ? "disabled-page" : ""}`}
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
                                currentPage < totalPages && setCurrentPage(currentPage + 1)
                            }
                            className={`pagination-arrow ${
                                currentPage === totalPages ? "disabled-page" : ""
                            }`}
                        >
                            Next &gt;
                        </span>
                    </div>
                </section>
            </SectionPageLayout>

            {showDeleteModal && selectedEvent && (
                <div className="modal-overlay">
                    <div className="delete-modal">
                        <p className="delete-modal-text">
                            Are you sure you want to delete{" "}
                            <strong>{selectedEvent.title}</strong>?
                        </p>

                        <div className="delete-modal-actions">
                            <button
                                type="button"
                                className="modal-button modal-confirm-button"
                                onClick={handleConfirmDelete}
                            >
                                Yes, delete
                            </button>

                            <button
                                type="button"
                                className="modal-button modal-cancel-button"
                                onClick={handleCloseDeleteModal}
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default EventsTablePage;