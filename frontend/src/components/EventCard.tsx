import "./styles/event-card.css";
import type { EventItem } from "../types/event";
import { useEvents } from "../context/EventsContext";

interface EventCardProps {
    event: EventItem;
    onView: (id: string | number) => void;
    onEdit?: (id: string | number) => void;
    onDelete?: (event: EventItem) => void;
}

function EventCard({ event, onView, onEdit, onDelete }: EventCardProps) {
    const { favorites, toggleFavorite } = useEvents();

    return (
        <div
            className="event-card"
            style={{
                backgroundImage: event.imageUrl ? `url(${event.imageUrl})` : "none",
            }}
        >
            <div className="event-card-overlay">
                <div className="event-card-content">
                    <p className="event-card-category">{event.category}</p>
                    <h3 className="event-card-title">{event.title}</h3>

                    <div className="event-card-meta">
                        <span className="event-card-meta-chip">{event.date}</span>
                        <span className="event-card-meta-chip">{event.location}</span>
                        <span className="event-card-meta-chip">{event.price}</span>
                    </div>
                </div>

                <div className="event-card-actions">
                    <div className="event-card-buttons">
                        <button
                            type="button"
                            className="event-card-button event-card-view-button"
                            onClick={() => onView(event.id)}
                        >
                            View
                        </button>

                        {onEdit && (
                            <button
                                type="button"
                                className="event-card-button event-card-edit-button"
                                onClick={() => onEdit(event.id)}
                            >
                                Edit
                            </button>
                        )}

                        {onDelete && (
                            <button
                                type="button"
                                className="event-card-button event-card-delete-button"
                                onClick={() => onDelete(event)}
                            >
                                Delete
                            </button>
                        )}
                    </div>

                    <button
                        className="event-card-favorite-button"
                        onClick={() => toggleFavorite(event.id)}
                        type="button"
                        aria-label="Toggle favorite"
                    >
                        {favorites.includes(event.id) ? "♥" : "♡"}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default EventCard;