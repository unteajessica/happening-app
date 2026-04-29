import "./styles/event-details-page.css";
import Navbar from "../components/NavBar";
import { useNavigate, useParams } from "react-router-dom";
import { useEvents } from "../context/EventsContext";
import { useState, useEffect } from "react";
import { saveLastViewedEvent } from "../utils/cookies";
import {
    ArrowLeft,
    CalendarDays,
    MapPin,
    Ticket,
    Pencil,
    Trash2,
    MessageCircle,
    Send,
} from "lucide-react";
import type { EventItem } from "../types/event";
import type { CommentItem } from "../types/comment";
import {
    fetchEventById,
    fetchCommentsByEventId,
    createCommentRequest,
    deleteCommentRequest,
} from "../services/eventsApi";

function EventDetailsPage() {
    const navigate = useNavigate();
    const { id } = useParams();
    const { newEvents, deleteEvent } = useEvents();

    const [event, setEvent] = useState<EventItem | null>(null);
    const [comments, setComments] = useState<CommentItem[]>([]);
    const [author, setAuthor] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [fetchError, setFetchError] = useState("");
    const [commentsError, setCommentsError] = useState("");
    const [commentSubmitError, setCommentSubmitError] = useState("");
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [serverError, setServerError] = useState("");

    const eventId = Number(id);

    useEffect(() => {
        if (id) saveLastViewedEvent(Number(id));
    }, [id]);

    useEffect(() => {
        const loadEvent = async () => {
            if (!eventId) {
                setFetchError("Event not found.");
                setEvent(null);
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setFetchError("");

                const fetchedEvent = await fetchEventById(eventId);
                setEvent(fetchedEvent);
                setFetchError("");
            } catch (error) {
                const localEvent = newEvents.find((item) => item.id === eventId);

                if (localEvent) {
                    setEvent(localEvent);
                    setFetchError("");
                } else {
                    setEvent(null);

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
    }, [eventId, newEvents]);

    useEffect(() => {
        const loadComments = async () => {
            if (!eventId) return;

            try {
                setCommentsError("");
                const fetchedComments = await fetchCommentsByEventId(eventId);
                setComments(fetchedComments);
            } catch (error) {
                if (error instanceof Error) {
                    setCommentsError(error.message);
                } else {
                    setCommentsError("Failed to load comments.");
                }
            }
        };

        if (eventId) {
            loadComments();
        }
    }, [eventId]);

    const handleBack = () => {
        if (window.history.length > 1) {
            navigate(-1);
        } else {
            navigate("/events-table");
        }
    };

    const handleDeleteYes = async () => {
        if (!event) return;

        setServerError("");

        try {
            await deleteEvent(event.id);
            navigate("/events-table");
        } catch (error) {
            if (error instanceof Error) {
                setServerError(error.message);
            } else {
                setServerError("Something went wrong while deleting the event.");
            }
        }
    };

    const handleDeleteNo = () => {
        setShowDeleteModal(false);
        setServerError("");
    };

    const handleAddComment = async () => {
        if (!event) return;

        if (!author.trim() || !message.trim()) {
            setCommentSubmitError("Author and message are required.");
            return;
        }

        try {
            setCommentSubmitError("");

            const createdComment = await createCommentRequest({
                eventId: event.id,
                author,
                message,
            });

            setComments((prev) => [createdComment, ...prev]);
            setAuthor("");
            setMessage("");
        } catch (error) {
            if (error instanceof Error) {
                setCommentSubmitError(error.message);
            } else {
                setCommentSubmitError("Failed to add comment.");
            }
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        try {
            await deleteCommentRequest(commentId);
            setComments((prev) => prev.filter((comment) => comment.id !== commentId));
        } catch (error) {
            if (error instanceof Error) {
                setCommentSubmitError(error.message);
            } else {
                setCommentSubmitError("Failed to delete comment.");
            }
        }
    };

    if (loading) {
        return (
            <div className="app-shell">
                <Navbar />
                <main className="event-details-page">
                    <section className="event-not-found-card">
                        <p className="event-panel-kicker">Loading</p>
                        <h1 className="event-not-found-title">Loading event...</h1>
                    </section>
                </main>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="app-shell">
                <Navbar />
                <main className="event-details-page">
                    <section className="event-not-found-card">
                        <p className="event-panel-kicker">Not found</p>
                        <h1 className="event-not-found-title">Event not found</h1>
                        <p className="event-not-found-text">
                            {fetchError ||
                                "The event you are trying to open no longer exists or may have been removed."}
                        </p>

                        <button
                            type="button"
                            className="event-back-link event-back-link-solid"
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

            <main className="event-details-page">
                <section
                    className={`event-hero ${!event.imageUrl ? "event-hero-fallback" : ""}`}
                    style={
                        event.imageUrl
                            ? { backgroundImage: `url(${event.imageUrl})` }
                            : undefined
                    }
                >
                    <div className="event-hero-overlay"></div>

                    <div className="event-hero-topbar">
                        <button
                            type="button"
                            className="event-back-link"
                            onClick={handleBack}
                        >
                            <ArrowLeft size={16} />
                            Back
                        </button>
                    </div>

                    <div className="event-hero-content">
                        <p className="event-hero-category">{event.category}</p>
                        <h1 className="event-hero-title">{event.title}</h1>
                        <p className="event-hero-description">{event.description}</p>

                        <div className="event-hero-meta">
                            <span className="event-hero-chip">
                                <CalendarDays size={16} />
                                {event.date}
                            </span>

                            <span className="event-hero-chip">
                                <MapPin size={16} />
                                {event.location}
                            </span>

                            <span className="event-hero-chip">
                                <Ticket size={16} />
                                {event.price}
                            </span>
                        </div>
                    </div>
                </section>

                <section className="event-details-layout">
                    <div className="event-details-main">
                        <article className="event-panel">
                            <div className="event-panel-header">
                                <p className="event-panel-kicker">Overview</p>
                                <h3>About this event</h3>
                            </div>

                            <p className="event-panel-text">{event.description}</p>
                        </article>

                        <article className="event-panel">
                            <div className="event-panel-header">
                                <p className="event-panel-kicker">Information</p>
                                <h3>Event information</h3>
                            </div>

                            <div className="event-info-grid">
                                <div className="event-info-item">
                                    <span className="event-info-label">Title</span>
                                    <span className="event-info-value">{event.title}</span>
                                </div>

                                <div className="event-info-item">
                                    <span className="event-info-label">Category</span>
                                    <span className="event-info-value">{event.category}</span>
                                </div>

                                <div className="event-info-item">
                                    <span className="event-info-label">Date</span>
                                    <span className="event-info-value">{event.date}</span>
                                </div>

                                <div className="event-info-item">
                                    <span className="event-info-label">Location</span>
                                    <span className="event-info-value">{event.location}</span>
                                </div>

                                <div className="event-info-item">
                                    <span className="event-info-label">Price</span>
                                    <span className="event-info-value">{event.price}</span>
                                </div>

                                <div className="event-info-item">
                                    <span className="event-info-label">Comments</span>
                                    <span className="event-info-value">{comments.length}</span>
                                </div>
                            </div>
                        </article>

                        <article className="event-panel">
                            <div className="event-panel-header">
                                <p className="event-panel-kicker">Discussion</p>
                                <h3>Comments</h3>
                            </div>

                            <div className="event-comments-form">
                                <input
                                    type="text"
                                    className="event-comment-input"
                                    placeholder="Your name"
                                    value={author}
                                    onChange={(e) => setAuthor(e.target.value)}
                                />

                                <textarea
                                    className="event-comment-textarea"
                                    placeholder="Write a comment..."
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                />

                                {commentSubmitError && (
                                    <p className="event-comment-error">{commentSubmitError}</p>
                                )}

                                <button
                                    type="button"
                                    className="event-comment-submit"
                                    onClick={handleAddComment}
                                >
                                    <Send size={16} />
                                    Add comment
                                </button>
                            </div>

                            {commentsError ? (
                                <p className="event-comment-error">{commentsError}</p>
                            ) : comments.length === 0 ? (
                                <p className="event-panel-text">No comments yet.</p>
                            ) : (
                                <div className="event-comments-list">
                                    {comments.map((comment) => (
                                        <div key={comment.id} className="event-comment-card">
                                            <div className="event-comment-top">
                                                <div>
                                                    <p className="event-comment-author">
                                                        {comment.author}
                                                    </p>
                                                    <p className="event-comment-date">
                                                        {new Date(comment.createdAt).toLocaleString()}
                                                    </p>
                                                </div>

                                                <button
                                                    type="button"
                                                    className="event-comment-delete"
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                >
                                                    Delete
                                                </button>
                                            </div>

                                            <p className="event-comment-message">
                                                {comment.message}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </article>
                    </div>

                    <aside className="event-details-aside">
                        <div className="event-side-card">
                            <div className="event-panel-header">
                                <p className="event-panel-kicker">Manage</p>
                                <h3>Quick actions</h3>
                            </div>

                            <p className="event-side-text">
                                Update this event, go back to browsing, or permanently
                                remove it from your list.
                            </p>

                            <div className="event-side-actions">
                                <button
                                    type="button"
                                    className="event-action-button event-action-back"
                                    onClick={handleBack}
                                >
                                    <ArrowLeft size={16} />
                                    Back
                                </button>

                                <button
                                    type="button"
                                    className="event-action-button event-action-edit"
                                    onClick={() => navigate(`/edit-event/${event.id}`)}
                                >
                                    <Pencil size={16} />
                                    Edit event
                                </button>

                                <button
                                    type="button"
                                    className="event-action-button event-action-delete"
                                    onClick={() => {
                                        setServerError("");
                                        setShowDeleteModal(true);
                                    }}
                                >
                                    <Trash2 size={16} />
                                    Delete event
                                </button>
                            </div>
                        </div>

                        <div className="event-side-card">
                            <div className="event-panel-header">
                                <p className="event-panel-kicker">Community</p>
                                <h3>Activity</h3>
                            </div>

                            <p className="event-side-text">
                                This event currently has <strong>{comments.length}</strong> comment
                                {comments.length === 1 ? "" : "s"}.
                            </p>
                        </div>
                    </aside>
                </section>

                {showDeleteModal && (
                    <div className="event-modal-overlay">
                        <div className="event-delete-modal">
                            <p className="event-delete-modal-kicker">Delete event</p>
                            <h3 className="event-delete-modal-title">
                                Are you sure?
                            </h3>

                            <p className="event-delete-modal-text">
                                You are about to delete <strong>{event.title}</strong>.
                                This action cannot be undone.
                            </p>

                            {serverError && (
                                <p className="event-delete-modal-error">{serverError}</p>
                            )}

                            <div className="event-delete-modal-actions">
                                <button
                                    type="button"
                                    className="event-modal-button event-modal-cancel"
                                    onClick={handleDeleteNo}
                                >
                                    No, keep it
                                </button>

                                <button
                                    type="button"
                                    className="event-modal-button event-modal-confirm"
                                    onClick={handleDeleteYes}
                                >
                                    Yes, delete
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}

export default EventDetailsPage;