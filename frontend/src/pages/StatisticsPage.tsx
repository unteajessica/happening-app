import "./styles/statistics-page.css";
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
import Navbar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../context/EventsContext";
import { BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import SectionPageLayout from "../components/SectionPageLayout";
import InsightCard from "../components/InsightCard";
import {
    fetchCategoryStats,
    fetchPriceStats,
    fetchCommentStats,
    type CategoryStat,
    type PriceStat,
    type CommentStatsResponse,
} from "../services/eventsApi";

function StatisticsPage() {
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 600);
    const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
    const [commentStats, setCommentStats] = useState<CommentStatsResponse | null>(null);
    const [priceStats, setPriceStats] = useState<PriceStat[]>([]);
    const [statsError, setStatsError] = useState("");

    const navigate = useNavigate();
    const { newEvents: events } = useEvents();

    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 600);
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    useEffect(() => {
        const loadStats = async () => {
            try {
                setStatsError("");

                const [categories, pricing, comments] = await Promise.all([
                    fetchCategoryStats(),
                    fetchPriceStats(),
                    fetchCommentStats(),
                ]);

                setCategoryStats(
                    categories.sort((a: CategoryStat, b: CategoryStat) => b.count - a.count)
                );
                setPriceStats(pricing);
                setCommentStats(comments);
            } catch (error) {
                if (error instanceof Error) {
                    setStatsError(error.message);
                } else {
                    setStatsError("Failed to load statistics.");
                }
            }
        };

        loadStats();
    }, []);

    const mobileBarData = categoryStats.slice(0, 5);

    const freeCount =
        priceStats.find((item) => item.name === "Free")?.value ?? 0;

    const paidCount =
        priceStats.find((item) => item.name === "Paid")?.value ?? 0;

    const topCategory = categoryStats.length > 0 ? categoryStats[0] : null;

    const totalComments = commentStats?.totalComments ?? 0;

    const mostCommentedEvent =
        commentStats?.mostCommentedEvents && commentStats.mostCommentedEvents.length > 0
            ? commentStats.mostCommentedEvents[0]
            : null;

    const topCommentedEvents =
        commentStats?.mostCommentedEvents.slice(0, 5) ?? [];

    return (
        <div className="app-shell">
            <Navbar />

            <SectionPageLayout
                pageClassName="statistics-page"
                eyebrow="Insights"
                title="Event Statistics"
                description="Explore how your event collection is distributed across categories and pricing."
                actions={
                    <button
                        className="statistics-split-button"
                        onClick={() => navigate("/split-view")}
                        type="button"
                    >
                        <BarChart3 size={16} />
                        Open Split View
                    </button>
                }
                insights={
                    <>
                        <InsightCard label="Events" value={events.length} />
                        <InsightCard label="Free" value={freeCount} />
                        <InsightCard label="Paid" value={paidCount} />
                        <InsightCard label="Comments" value={totalComments} />
                        <InsightCard
                            label="Top category"
                            value={topCategory ? topCategory.category : "—"}
                        />
                        <InsightCard
                            label="Most discussed"
                            value={mostCommentedEvent ? mostCommentedEvent.eventTitle : "—"}
                        />
                    </>
                }
            >
                <section className="statistics-panel">
                    <div className="statistics-panel-header">
                        <div>
                            <p className="statistics-panel-kicker">Overview</p>
                            <h2 className="statistics-panel-title">Visual breakdown</h2>
                        </div>
                    </div>

                    {statsError && (
                        <p className="statistics-error-message">{statsError}</p>
                    )}

                    <div className="statistics-grid">
                        <article className="statistics-card">
                            <div className="statistics-card-text">
                                <h3>Events per Category</h3>
                                <p>
                                    A breakdown of how many events belong to each category.
                                    Useful for spotting which types of events are most common.
                                </p>
                            </div>

                            <div className="statistics-chart-wrap statistics-chart-large">
                                <ResponsiveContainer width="100%" height={340}>
                                    <BarChart data={isMobile ? mobileBarData : categoryStats}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="category"
                                            interval={0}
                                            angle={-35}
                                            textAnchor="end"
                                            height={70}
                                        />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip />
                                        <Bar dataKey="count" fill="#a684eb" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </article>

                        <article className="statistics-card">
                            <div className="statistics-card-text">
                                <h3>Free vs Paid Events</h3>
                                <p>
                                    A breakdown of free versus paid events. Helps
                                    understand the accessibility of events and how many
                                    require a ticket purchase.
                                </p>
                            </div>

                            <div className="statistics-chart-wrap statistics-chart-medium">
                                <ResponsiveContainer width="100%" height={320}>
                                    <PieChart>
                                        <Pie
                                            data={priceStats}
                                            dataKey="value"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={70}
                                            outerRadius={120}
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
                        </article>

                        <article className="statistics-card">
                            <div className="statistics-card-text">
                                <h3>Most Commented Events</h3>
                                <p>
                                    A ranking of the events with the most comments. This helps identify
                                    which events generated the most discussion from users.
                                </p>
                            </div>

                            <div className="statistics-chart-wrap statistics-chart-large">
                                <ResponsiveContainer width="100%" height={340}>
                                    <BarChart data={topCommentedEvents}>
                                        <CartesianGrid strokeDasharray="3 3" />
                                        <XAxis
                                            dataKey="eventTitle"
                                            interval={0}
                                            angle={-35}
                                            textAnchor="end"
                                            height={90}
                                        />
                                        <YAxis allowDecimals={false} />
                                        <Tooltip />
                                        <Bar dataKey="commentCount" fill="#a684eb" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </article>
                    </div>
                </section>
            </SectionPageLayout>
        </div>
    );
}

export default StatisticsPage;