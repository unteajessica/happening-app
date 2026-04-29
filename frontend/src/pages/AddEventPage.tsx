import "./styles/add-event-page.css";
import Navbar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useEvents } from "../context/EventsContext";
import { EventFormErrors, validateEventForm } from "../validators/eventValidation";
import {
    ArrowLeft,
    CalendarDays,
    MapPin,
    Plus,
    Tag,
    Ticket,
    Image as ImageIcon,
} from "lucide-react";

function AddEventPage() {
    const navigate = useNavigate();
    const { addEvent } = useEvents();

    const [title, setTitle] = useState("");
    const [category, setCategory] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");

    const [errors, setErrors] = useState<EventFormErrors>({});
    const [serverError, setServerError] = useState("");

    const handleSave = async () => {
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
            return;
        }

        setErrors({});
        setServerError("");

        const newEvent = {
            title,
            category,
            date,
            location,
            price,
            description,
            imageUrl,
        };

        try {
            await addEvent(newEvent);
            navigate("/events-table");
        } catch (error) {
            if (error instanceof Error) {
                setServerError(error.message);
            } else {
                setServerError("Something went wrong while adding the event.");
            }
        }
    };

    const handleCancel = () => {
        navigate("/events-table");
    };

    return (
        <div className="app-shell">
            <Navbar />

            <main className="add-event-page">
                <section
                    className={`add-event-hero ${!imageUrl ? "add-event-hero-fallback" : ""}`}
                    style={imageUrl ? { backgroundImage: `url(${imageUrl})` } : undefined}
                >
                    <div className="add-event-hero-overlay"></div>

                    <div className="add-event-hero-topbar">
                        <button
                            type="button"
                            className="add-back-link"
                            onClick={handleCancel}
                        >
                            <ArrowLeft size={16} />
                            Back
                        </button>
                    </div>

                    <div className="add-event-hero-content">
                        <p className="add-event-kicker-light">Creating</p>
                        <h1 className="add-event-hero-title">
                            {title || "Add New Event"}
                        </h1>
                        <p className="add-event-hero-lead">
                            Add an event your audience can discover instantly, with information that
                            feels clear, complete, and worth exploring.
                        </p>

                        <div className="add-event-hero-meta">
                            <span className="add-event-hero-chip">
                                <Tag size={16} />
                                {category || "Category"}
                            </span>

                            <span className="add-event-hero-chip">
                                <CalendarDays size={16} />
                                {date || "Date"}
                            </span>

                            <span className="add-event-hero-chip">
                                <MapPin size={16} />
                                {location || "Location"}
                            </span>

                            <span className="add-event-hero-chip">
                                <Ticket size={16} />
                                {price || "Price"}
                            </span>
                        </div>
                    </div>
                </section>

                <section className="add-event-layout">
                    <div className="add-event-main">
                        <article className="add-event-panel">
                            <div className="add-event-panel-header">
                                <p className="add-event-panel-kicker">Form</p>
                                <h2>Add event details</h2>
                            </div>

                            {serverError && <p className="add-server-error">{serverError}</p>}

                            <div className="add-event-form-grid">
                                <div className="add-field-group">
                                    <label className="add-field-label" htmlFor="title">
                                        Title
                                    </label>
                                    <input
                                        id="title"
                                        type="text"
                                        className="add-event-input"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                    />
                                    <p className="add-field-error">{errors.title || ""}</p>
                                </div>

                                <div className="add-field-group">
                                    <label className="add-field-label" htmlFor="category">
                                        Category
                                    </label>
                                    <input
                                        id="category"
                                        type="text"
                                        className="add-event-input"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    />
                                    <p className="add-field-error">{errors.category || ""}</p>
                                </div>

                                <div className="add-field-group">
                                    <label className="add-field-label" htmlFor="date">
                                        Date
                                    </label>
                                    <input
                                        id="date"
                                        type="text"
                                        className="add-event-input"
                                        value={date}
                                        onChange={(e) => setDate(e.target.value)}
                                    />
                                    <p className="add-field-error">{errors.date || ""}</p>
                                </div>

                                <div className="add-field-group">
                                    <label className="add-field-label" htmlFor="location">
                                        Location
                                    </label>
                                    <input
                                        id="location"
                                        type="text"
                                        className="add-event-input"
                                        value={location}
                                        onChange={(e) => setLocation(e.target.value)}
                                    />
                                    <p className="add-field-error">{errors.location || ""}</p>
                                </div>

                                <div className="add-field-group">
                                    <label className="add-field-label" htmlFor="price">
                                        Price
                                    </label>
                                    <input
                                        id="price"
                                        type="text"
                                        className="add-event-input"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                    />
                                    <p className="add-field-error">{errors.price || ""}</p>
                                </div>

                                <div className="add-field-group">
                                    <label className="add-field-label" htmlFor="imageUrl">
                                        Image URL
                                    </label>
                                    <input
                                        id="imageUrl"
                                        type="text"
                                        className="add-event-input"
                                        placeholder="https://..."
                                        value={imageUrl}
                                        onChange={(e) => setImageUrl(e.target.value)}
                                    />
                                    <p className="add-field-error">{errors.imageUrl || ""}</p>
                                </div>

                                <div className="add-field-group add-field-group-full">
                                    <label className="add-field-label" htmlFor="description">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        className="add-event-textarea"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                    />
                                    <p className="add-field-error">
                                        {errors.description || ""}
                                    </p>
                                </div>
                            </div>
                        </article>
                    </div>

                    <aside className="add-event-aside">
                        <div className="add-side-card">
                            <div className="add-event-panel-header">
                                <p className="add-event-panel-kicker">Actions</p>
                                <h2>Create event</h2>
                            </div>

                            <p className="add-side-text">
                                Save this event to your collection, or return to browsing
                                without publishing anything new.
                            </p>

                            <div className="add-side-actions">
                                <button
                                    type="button"
                                    className="add-action-button add-action-cancel"
                                    onClick={handleCancel}
                                >
                                    <ArrowLeft size={16} />
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="add-action-button add-action-save"
                                    onClick={handleSave}
                                >
                                    <Plus size={16} />
                                    Save event
                                </button>
                            </div>
                        </div>

                        <div className="add-side-card">
                            <div className="add-event-panel-header">
                                <p className="add-event-panel-kicker">Media</p>
                                <h2>Image preview</h2>
                            </div>

                            <div className="add-image-preview-card">
                                {imageUrl ? (
                                    <img
                                        src={imageUrl}
                                        alt={title || "Event preview"}
                                        className="add-image-preview"
                                    />
                                ) : (
                                    <div className="add-image-preview-placeholder">
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

export default AddEventPage;