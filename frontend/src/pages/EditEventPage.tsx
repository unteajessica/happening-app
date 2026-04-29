import "./styles/edit-event-page.css";
import Navbar from "../components/NavBar";
import { useNavigate, useParams } from "react-router-dom";
import { useEvents } from "../context/EventsContext";
import { useEffect, useState } from "react";
import { EventFormErrors, validateEventForm } from "../validators/eventValidation";
import {
    ArrowLeft,
    CalendarDays,
    MapPin,
    Save,
    Tag,
    Ticket,
    Image as ImageIcon,
} from "lucide-react";
import type { EventItem } from "../types/event";
import { fetchEventById } from "../services/eventsApi";

function EditEventPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { newEvents, updateEvent, isOnline } = useEvents();

    const eventId = Number(id);

    const [event, setEvent] = useState<EventItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState("");

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [description, setDescription] = useState("");

    const [errors, setErrors] = useState<EventFormErrors>({});
    const [serverError, setServerError] = useState("");

    useEffect(() => {
        const loadEvent = async () => {
            if (!eventId) {
                setFetchError("Event not found.");
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setFetchError("");
                const fetchedEvent = await fetchEventById(eventId);
                setEvent(fetchedEvent);

                setTitle(fetchedEvent.title);
                setCategory(fetchedEvent.category);
                setDate(fetchedEvent.date);
                setLocation(fetchedEvent.location);
                setPrice(fetchedEvent.price);
                setImageUrl(fetchedEvent.imageUrl);
                setDescription(fetchedEvent.description);
            } catch (error) {
                const localEvent = newEvents.find((item) => item.id === eventId);

                if (!isOnline && localEvent) {
                    setEvent(localEvent);
                    setTitle(localEvent.title);
                    setCategory(localEvent.category);
                    setDate(localEvent.date);
                    setLocation(localEvent.location);
                    setPrice(localEvent.price);
                    setImageUrl(localEvent.imageUrl);
                    setDescription(localEvent.description);
                    setFetchError("");
                } else {
                    if (error instanceof Error) {
                        setFetchError(error.message);
                    } else {
                        setFetchError("Failed to load event.");
                    }
                }
            } finally {
                setLoading(false);
            }
        };

        loadEvent();
    }, [eventId, newEvents, isOnline]);

    const handleUpdate = async () => {
        if (!event) return;

        const formValues = {
            title,
            category,
            date,
            location,
            price,
            imageUrl,
            description,
        };

        const validationErrors = validateEventForm(formValues);

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            setServerError("");
            return;
        }

        setErrors({});
        setServerError("");

        const updatedEvent = {
            ...event,
            title,
            category,
            date,
            location,
            price,
            imageUrl,
            description,
        };

        try {
            await updateEvent(updatedEvent);
            navigate(`/event-details/${event.id}`);
        } catch (error) {
            if (error instanceof Error) {
                setServerError(error.message);
            } else {
                setServerError("Something went wrong while updating the event.");
            }
        }
    };

    const handleCancel = () => {
        if (!event) return;
        navigate(`/event-details/${event.id}`);
    };

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate("/events-table");
        }
    };

    if (loading) {
        return (
            <div className="app-shell">
                <Navbar />
                <main className="edit-event-page">
                    <section className="edit-not-found-card">
                        <p className="edit-event-kicker">Loading</p>
                        <h1 className="edit-event-title">Loading event...</h1>
                    </section>
                </main>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="app-shell">
                <Navbar />
                <main className="edit-event-page">
                    <section className="edit-not-found-card">
                        <p className="edit-event-kicker">Not found</p>
                        <h1 className="edit-event-title">Event not found</h1>
                        <p className="edit-event-lead">
                            {fetchError ||
                                "The event you want to edit does not exist anymore or may have been removed."}
                        </p>

                        <button
                            type="button"
                            className="edit-back-link edit-back-link-solid"
                            onClick={() => navigate("/events-table")}
                        >
                            <ArrowLeft size={16} />
                            Back to events
                        </button>
                    </section>
                </main>
            </div>
        );
    }

    return (
        <div className="app-shell">
            <Navbar />

            <main className="edit-event-page">
                <section
                    className={`edit-event-hero ${!imageUrl ? "edit-event-hero-fallback" : ""}`}
                    style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
                >
                    <div className="edit-event-hero-overlay"></div>

                    <div className="edit-event-hero-topbar">
                        <button
                            type="button"
                            className="edit-back-link"
                            onClick={handleBack}
                        >
                            <ArrowLeft size={16} />
                            Back
                        </button>
                    </div>

                    <div className="edit-event-hero-content">
                        <p className="edit-event-kicker-light">Editing</p>
                        <h1 className="edit-event-hero-title">{title || event.title}</h1>
                        <p className="edit-event-hero-lead">
                            Refine the event details, update key information, and keep
                            your event collection polished and accurate.
                        </p>

                        <div className="edit-event-hero-meta">
                            <span className="edit-event-hero-chip">
                                <Tag size={16} />
                                {category || event.category}
                            </span>

                            <span className="edit-event-hero-chip">
                                <CalendarDays size={16} />
                                {date || event.date}
                            </span>

                            <span className="edit-event-hero-chip">
                                <MapPin size={16} />
                                {location || event.location}
                            </span>

                            <span className="edit-event-hero-chip">
                                <Ticket size={16} />
                                {price || event.price}
                            </span>
                        </div>
                    </div>
                </section>

                <section className="edit-event-layout">
                    <div className="edit-event-main">
                        <article className="edit-event-panel">
                            <div className="edit-event-panel-header">
                                <p className="edit-event-panel-kicker">Form</p>
                                <h2>Edit event details</h2>
                            </div>

                            <div className="edit-event-form-grid">
                                <div className="edit-field-group">
                                    <label className="edit-field-label" htmlFor="title">
                                        Title
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="edit-event-input"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                    <p className="edit-field-error">{errors.title || ""}</p>
                                </div>

                                <div className="edit-field-group">
                                    <label className="edit-field-label" htmlFor="category">
                                        Category
                                    </label>
                                    <input
                                        id="category"
                                        type="text"
                                        className="edit-event-input"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    />
                                    <p className="edit-field-error">{errors.category || ""}</p>
                                </div>

                                <div className="edit-field-group">
                                    <label className="edit-field-label" htmlFor="date">
                                        Date
                                    </label>
                                    <input
                                        id="date"
                                        type="text"
                                        className="edit-event-input"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                    />
                                    <p className="edit-field-error">{errors.date || ""}</p>
                                </div>

                                <div className="edit-field-group">
                                    <label className="edit-field-label" htmlFor="location">
                                        Location
                                    </label>
                                    <input
                                        id="location"
                                        type="text"
                                        className="edit-event-input"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                    <p className="edit-field-error">{errors.location || ""}</p>
                                </div>

                                <div className="edit-field-group">
                                    <label className="edit-field-label" htmlFor="price">
                                        Price
                                    </label>
                                    <input
                                        id="price"
                                        type="text"
                                        className="edit-event-input"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                    <p className="edit-field-error">{errors.price || ""}</p>
                                </div>

                                <div className="edit-field-group">
                                    <label className="edit-field-label" htmlFor="imageUrl">
                                        Image URL
                                    </label>
                                    <input
                                        id="imageUrl"
                                        type="text"
                                        className="edit-event-input"
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                        placeholder="https://..."
                                    />
                                    <p className="edit-field-error">{errors.imageUrl || ""}</p>
                                </div>

                                <div className="edit-field-group edit-field-group-full">
                                    <label className="edit-field-label" htmlFor="description">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        className="edit-event-textarea"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                    <p className="edit-field-error">
                                        {errors.description || ""}
                                    </p>
                                </div>
                            </div>
                        </article>
                    </div>

                    <aside className="edit-event-aside">
                        <div className="edit-side-card">
                            <div className="edit-event-panel-header">
                                <p className="edit-event-panel-kicker">Actions</p>
                                <h2>Manage editing</h2>
                            </div>

                            <p className="edit-side-text">
                                Save your changes, or return to the event details page
                                without updating anything.
                            </p>

                            {serverError && (
                                <p className="edit-server-error">{serverError}</p>
                            )}

                            <div className="edit-side-actions">
                                <button
                                    type="button"
                                    className="edit-action-button edit-action-cancel"
                                    onClick={handleCancel}
                                >
                                    <ArrowLeft size={16} />
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="edit-action-button edit-action-save"
                                    onClick={handleUpdate}
                                >
                                    <Save size={16} />
                                    Update event
                                </button>
                            </div>
                        </div>

                        <div className="edit-side-card">
                            <div className="edit-event-panel-header">
                                <p className="edit-event-panel-kicker">Media</p>
                                <h2>Image preview</h2>
                            </div>

                            <div className="edit-image-preview-card">
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt={title || "Event preview"}
                                        className="edit-image-preview"
                                    />
                                ) : (
                                    <div className="edit-image-preview-placeholder">
                                        <ImageIcon size={20} />
                                        <span>No image selected</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </aside>
                </section>
            </main>
        </div>
    );
}

export default EditEventPage;