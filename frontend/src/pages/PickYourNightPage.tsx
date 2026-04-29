import "./styles/pick-your-night-page.css";
import Navbar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../context/EventsContext";
import { useEffect, useMemo, useState } from "react";
import type { EventItem } from "../types/event";
import {
    CalendarDays,
    MapPin,
    Ticket,
    Crown,
    ArrowRight,
    Heart,
    Sparkles,
} from "lucide-react";

function PickYourNightPage() {
    const navigate = useNavigate();
    const { newEvents, favorites } = useEvents();

    const favoriteEvents = useMemo(
        () => newEvents.filter((e) => favorites.includes(e.id)),
        [newEvents, favorites]
    );

    const [queue, setQueue] = useState<EventItem[]>([]);
    const [left, setLeft] = useState<EventItem | null>(null);
    const [right, setRight] = useState<EventItem | null>(null);
    const [round, setRound] = useState(1);
    const [winner, setWinner] = useState<EventItem | null>(null);
    const [battleKey, setBattleKey] = useState(0);
    const [selectedFinalId, setSelectedFinalId] = useState<string | number | null>(null);

    useEffect(() => {
        if (favoriteEvents.length >= 2) {
            setLeft(favoriteEvents[0]);
            setRight(favoriteEvents[1]);
            setQueue(favoriteEvents.slice(2));
            setRound(1);
            setWinner(null);
            setBattleKey(0);
            setSelectedFinalId(null);
        } else {
            setLeft(null);
            setRight(null);
            setQueue([]);
            setRound(1);
            setWinner(null);
            setBattleKey(0);
            setSelectedFinalId(null);
        }
    }, [favoriteEvents]);

    const totalRounds = Math.max(favoriteEvents.length - 1, 0);

    const handlePick = (chosen: EventItem) => {
        if (queue.length === 0) {
            setSelectedFinalId(chosen.id);

            setTimeout(() => {
                setWinner(chosen);
                setSelectedFinalId(null);
            }, 1200);

            return;
        }

        const [next, ...rest] = queue;
        setLeft(chosen);
        setRight(next);
        setQueue(rest);
        setRound((r) => r + 1);
        setBattleKey((k) => k + 1);
    };

    if (favoriteEvents.length < 2) {
        return (
            <div className="app-shell pyn-page-shell">
                <Navbar />
                <main className="pick-your-night-page">
                    <section className="pyn-empty-state">
                        <div className="pyn-empty-icon">
                            <Heart size={24} />
                        </div>
                        <p className="pyn-empty-kicker">Not enough favorites</p>
                        <h1 className="pyn-empty-title">Pick Your Night!</h1>
                        <p className="pyn-empty-text">
                            You need at least 2 favorite events to start the face-off.
                            Save a few events first, then come back and let the game decide.
                        </p>
                        <button
                            type="button"
                            className="pyn-empty-button"
                            onClick={() => navigate("/favorites-page")}
                        >
                            Go to Favorites
                        </button>
                    </section>
                </main>
            </div>
        );
    }

    if (winner) {
        return (
            <div className="app-shell pyn-winner-shell">
                <div
                    className="pyn-winner-bg"
                    style={{
                        backgroundImage: winner.imageUrl
                            ? `url(${winner.imageUrl})`
                            : "none",
                    }}
                >
                    <div className="pyn-winner-overlay"></div>
                    <div className="pyn-winner-glow pyn-winner-glow-one"></div>
                    <div className="pyn-winner-glow pyn-winner-glow-two"></div>

                    <div className="pyn-sparkles">
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    <Navbar />

                    <main className="pick-your-night-page pyn-winner-page pyn-winner-boom">
                        <section className="pyn-winner-hero">
                            <div className="pyn-winner-badge">
                                <Crown size={18} />
                                Winner Selected
                            </div>

                            <h1 className="pyn-title pyn-title-winner">
                                Pick Your Night!
                            </h1>

                            <p className="pyn-subtitle pyn-subtitle-winner">
                                Your night is decided. Go make it memorable.
                            </p>
                        </section>

                        <section className="pyn-winner-card">
                            <div className="pyn-winner-card-top">
                                <p className="pyn-winner-kicker">{winner.category}</p>
                                <h2 className="pyn-winner-event-title">{winner.title}</h2>
                                <p className="pyn-winner-description">
                                    {winner.description}
                                </p>

                                <div className="pyn-winner-meta">
                                    <span className="pyn-winner-chip">
                                        <CalendarDays size={16} />
                                        {winner.date}
                                    </span>
                                    <span className="pyn-winner-chip">
                                        <MapPin size={16} />
                                        {winner.location}
                                    </span>
                                    <span className="pyn-winner-chip">
                                        <Ticket size={16} />
                                        {winner.price}
                                    </span>
                                </div>
                            </div>

                            <div className="pyn-winner-actions">
                                <button
                                    type="button"
                                    className="pyn-winner-button pyn-winner-primary"
                                    onClick={() => navigate(`/event-details/${winner.id}`)}
                                >
                                    View Event
                                    <ArrowRight size={16} />
                                </button>

                                <button
                                    type="button"
                                    className="pyn-winner-button pyn-winner-secondary"
                                    onClick={() => navigate("/favorites-page")}
                                >
                                    Back to Favorites
                                </button>
                            </div>
                        </section>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="app-shell pyn-page-shell">
            <Navbar />

            <main className="pick-your-night-page">
                <section className="pyn-hero">
                    <div className="pyn-hero-text">
                        <p className="pyn-eyebrow">Game Mode</p>
                        <h1 className="pyn-title">Pick Your Night!</h1>
                        <p className="pyn-subtitle">
                            Choose between two favorites until only one remains.
                        </p>
                    </div>

                    <div className="pyn-round-panel">
                        <div className="pyn-round-top">
                            <span className="pyn-round-label">Round</span>
                            <strong className="pyn-round-value">
                                {round} / {totalRounds}
                            </strong>
                        </div>

                        <div className="pyn-round-dots">
                            {Array.from({ length: totalRounds }).map((_, index) => (
                                <span
                                    key={index}
                                    className={`pyn-round-dot ${
                                        index < round ? "active" : ""
                                    }`}
                                ></span>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="pyn-battle-stage" key={battleKey}>
                    <button
                        className={`pyn-event-card pyn-event-card-left ${
                            selectedFinalId === left?.id ? "pyn-final-spin" : ""
                        }`}
                        onClick={() => left && handlePick(left)}
                        type="button"
                        disabled={selectedFinalId !== null}
                    >
                        <div
                            className="pyn-event-image-wrap"
                            style={{
                                backgroundImage: left?.imageUrl
                                    ? `url(${left.imageUrl})`
                                    : "none",
                            }}
                        >
                            <div className="pyn-event-image-overlay"></div>

                            <div className="pyn-event-content">
                                <p className="pyn-event-kicker">{left?.category}</p>
                                <h2 className="pyn-event-title">{left?.title}</h2>

                                <div className="pyn-event-meta">
                                    <span>{left?.date}</span>
                                    <span>{left?.location}</span>
                                    <span>{left?.price}</span>
                                </div>
                            </div>
                        </div>

                        <div className="pyn-card-footer">
                            <span className="pyn-pick-text">Pick this night</span>
                            <div className="pyn-pick-icon">+</div>
                        </div>
                    </button>

                    <div className="pyn-vs-wrap">
                        <div className="pyn-vs-ring"></div>
                        <div className="pyn-vs">
                            <Sparkles size={18} />
                            <span>VS</span>
                        </div>
                    </div>

                    <button
                        className={`pyn-event-card pyn-event-card-right ${
                            selectedFinalId === right?.id ? "pyn-final-spin" : ""
                        }`}
                        onClick={() => right && handlePick(right)}
                        type="button"
                        disabled={selectedFinalId !== null}
                    >
                        <div
                            className="pyn-event-image-wrap"
                            style={{
                                backgroundImage: right?.imageUrl
                                    ? `url(${right.imageUrl})`
                                    : "none",
                            }}
                        >
                            <div className="pyn-event-image-overlay"></div>

                            <div className="pyn-event-content">
                                <p className="pyn-event-kicker">{right?.category}</p>
                                <h2 className="pyn-event-title">{right?.title}</h2>

                                <div className="pyn-event-meta">
                                    <span>{right?.date}</span>
                                    <span>{right?.location}</span>
                                    <span>{right?.price}</span>
                                </div>
                            </div>
                        </div>

                        <div className="pyn-card-footer">
                            <span className="pyn-pick-text">Pick this night</span>
                            <div className="pyn-pick-icon">+</div>
                        </div>
                    </button>
                </section>
            </main>
        </div>
    );
}

export default PickYourNightPage;