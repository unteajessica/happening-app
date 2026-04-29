import "./styles/split-view-page.css";
import Navbar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../context/EventsContext";
import { useState, useEffect } from "react";
import type { EventItem } from "../types/event";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    PieChart,
    Pie,
    Cell,
    Legend,
    ResponsiveContainer,
} from "recharts";
import { Play, Square } from "lucide-react";
import SectionPageLayout from "../components/SectionPageLayout";
import InsightCard from "../components/InsightCard";
import {
    startGeneratorRequest,
    stopGeneratorRequest,
    fetchGeneratorStatus,
} from "../services/eventsApi";
import { io, Socket } from "socket.io-client";

function SplitViewPage() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isGenerating, setIsGenerating] = useState(false);
    const [socket, setSocket] = useState<Socket | null>(null);

    const eventsPerPage = 6;

    const navigate = useNavigate();
    const { newEvents, deleteEvent, toggleFavorite, favorites, reloadEvents } =
        useEvents();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 600);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const loadGeneratorStatus = async () => {
            try {
                const result = await fetchGeneratorStatus();
                setIsGenerating(result.isRunning);
            } catch (error) {
                console.error("Failed to fetch generator status:", error);
            }
        };

        loadGeneratorStatus();
    }, []);

    useEffect(() => {
        const socketConnection = io("http://localhost:3000");

        socketConnection.on("connect", () => {
            console.log("Connected to socket server");
        });

        socketConnection.on("event-created", async () => {
            await reloadEvents();
        });

        setSocket(socketConnection);

        return () => {
            socketConnection.disconnect();
        };
    }, [reloadEvents]);

    const handleToggleGenerate = async () => {
        try {
            if (isGenerating) {
                await stopGeneratorRequest();
                setIsGenerating(false);
            } else {
                await startGeneratorRequest();
                setIsGenerating(true);
            }
        } catch (error) {
            console.error("Failed to toggle generator:", error);
        }
    };

    const handleOpenDeleteModal = (event: EventItem) => {
        setSelectedEvent(event);
        setShowDeleteModal(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedEvent) return;

        await deleteEvent(selectedEvent.id);
        setShowDeleteModal(false);
        setSelectedEvent(null);
    };

    const handleCloseDeleteModal = () => {
        setSelectedEvent(null);
        setShowDeleteModal(false);
    };

    const indexOfLastEvent = currentPage * eventsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
    const currentEvents = newEvents.slice(indexOfFirstEvent, indexOfLastEvent);
    const totalPages = Math.ceil(newEvents.length / eventsPerPage);

    const categoryData = newEvents.reduce((acc, event) => {
        acc[event.category] = (acc[event.category] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const barData = Object.entries(categoryData)
        .map(([category, count]) => ({
            category,
            count,
        }))
        .sort((a, b) => b.count - a.count);

    const mobileBarData = barData.slice(0, 5);

    const freeCount = newEvents.filter((e) => e.price === "Free").length;
    const paidCount = newEvents.length - freeCount;

    const pieData = [
        { name: "Paid", value: paidCount },
        { name: "Free", value: freeCount },
    ];

    return (
        <div className="app-shell">
            <Navbar />

            <SectionPageLayout
                pageClassName="split-view-page"
                eyebrow="Live Analysis"
                title="Split View"
                description="Watch the data update in real time as events change on the left and the charts respond instantly on the right."
                actions={
                    <button
                        className={`generate-button ${isGenerating ? "generating" : ""}`}
                        onClick={handleToggleGenerate}
                        type="button"
                    >
                        {isGenerating ? (
                            <>
                                <Square size={16} />
                                Stop Generating
                            </>
                        ) : (
                            <>
                                <Play size={16} />
                                Add Random Data
                            </>
                        )}
                    </button>
                }
                insights={
                    <>
                        <InsightCard label="Events" value={newEvents.length} />
                        <InsightCard label="Free" value={freeCount} />
                        <InsightCard label="Paid" value={paidCount} />
                        <InsightCard label="Live mode" value={isGenerating ? "On" : "Off"} />
                    </>
                }
            >
                <section className="split-view-container">
                    <div className="split-table-side">
                        <div className="split-section-header">
                            <div>
                                <p className="split-section-kicker">Source</p>
                                <h2 className="split-section-title">Events</h2>
                            </div>
                        </div>

                        <div className="events-table-wrapper">
                            <table className="events-table">
                                <thead>
                                    <tr>
                                        <th>Event</th>
                                        <th>Category</th>
                                        <th>Price</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>

                                <tbody>
                                    {currentEvents.map((event) => (
                                        <tr key={event.id}>
                                            <td>{event.title}</td>
                                            <td>{event.category}</td>
                                            <td>{event.price}</td>
                                            <td className="actions-cell">
                                                <button
                                                    type="button"
                                                    className="action-button view-button"
                                                    onClick={() =>
                                                        navigate(`/event-details/${event.id}`)
                                                    }
                                                >
                                                    View
                                                </button>

                                                <button
                                                    type="button"
                                                    className="action-button delete-button"
                                                    onClick={() => handleOpenDeleteModal(event)}
                                                >
                                                    Delete
                                                </button>

                                                <button
                                                    className="heart-button"
                                                    onClick={() => toggleFavorite(event.id)}
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
                    </div>

                    <div className="split-charts-side">
                        <div className="split-section-header">
                            <div>
                                <p className="split-section-kicker">Response</p>
                                <h2 className="split-section-title">Statistics</h2>
                            </div>
                        </div>

                        <div className="split-chart-card">
                            <h3>Events per Category</h3>
                            <div className="split-chart-card-body">
                                <ResponsiveContainer width="100%" height={280}>
                                    <BarChart data={isMobile ? mobileBarData : barData}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="category"
                                            interval={0}
                                            angle={-35}
                                            textAnchor="end"
                                            height={60}
                                        />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip />
                                        <Bar
                                            dataKey="count"
                                            fill="#a684eb"
                                            isAnimationActive={true}
                                        />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="split-chart-card">
                            <h3>Free vs Paid Events</h3>
                            <div className="split-chart-card-body split-pie-wrap">
                                <ResponsiveContainer width="100%" height={260}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            dataKey="value"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={58}
                                            outerRadius={96}
                                            isAnimationActive={true}
                                            label={({ percent }) =>
                                                `${((percent ?? 0) * 100).toFixed(0)}%`
                                            }
                                        >
                                            <Cell fill="#a684eb" />
                                            <Cell fill="#111111" />
                                        </Pie>
                                        <Legend />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </section>
            </SectionPageLayout>

            {showDeleteModal && selectedEvent && (
                <div className="split-modal-overlay">
                    <div className="split-delete-modal">
                        <p className="split-delete-kicker">Delete event</p>
                        <h3 className="split-delete-title">Are you sure?</h3>
                        <p className="split-delete-text">
                            You are about to delete{" "}
                            <strong>{selectedEvent.title}</strong>.
                        </p>

                        <div className="split-delete-actions">
                            <button
                                type="button"
                                className="split-modal-button split-modal-cancel"
                                onClick={handleCloseDeleteModal}
                            >
                                No
                            </button>

                            <button
                                type="button"
                                className="split-modal-button split-modal-confirm"
                                onClick={handleConfirmDelete}
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SplitViewPage;