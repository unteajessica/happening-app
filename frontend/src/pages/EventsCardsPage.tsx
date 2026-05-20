import "./styles/events-cards-page.css";
import Navbar from "../components/NavBar";
import { useNavigate } from "react-router-dom";
import { useEvents } from "../context/EventsContext";
import { useState, useEffect, useRef, useCallback } from "react";
import type { EventItem } from "../types/event";
import EventCard from "../components/EventCard";
import { savePreferredView, saveLastPage, getLastPage } from "../utils/cookies";
import SectionPageLayout from "../components/SectionPageLayout";
import InsightCard from "../components/InsightCard";
import { fetchEventsPage } from "../services/eventsApi";
import { EVENTS_CARDS_MODE } from "../config/eventsDisplayMode";
import RequirePermission from "../components/RequirePermission";

function EventsCardsPage() {
    const navigate = useNavigate();
    const { newEvents, deleteEvent, favorites, reloadEvents } = useEvents();

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);

    const [currentPage, setCurrentPage] = useState(
        EVENTS_CARDS_MODE === "pagination" ? getLastPage() : 1
    );
    const [displayedEvents, setDisplayedEvents] = useState<EventItem[]>([]);
    const [totalPages, setTotalPages] = useState(1);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [isLoadingMore, setIsLoadingMore] = useState(false);
    const [prefetchedPage, setPrefetchedPage] = useState<{
        page: number;
        items: EventItem[];
    } | null>(null);

    const observerRef = useRef<IntersectionObserver | null>(null);
    const loadMoreTriggerRef = useRef<HTMLDivElement | null>(null);

    const eventsPerPage = 6;

    const handleOpenDeleteModal = (event: EventItem) => {
        setSelectedEvent(event);
        setShowDeleteModal(true);
    };

    const handleCloseDeleteModal = () => {
        setSelectedEvent(null);
        setShowDeleteModal(false);
    };

    const handleConfirmDelete = async () => {
        if (!selectedEvent) return;

        await deleteEvent(selectedEvent.id);
        await reloadEvents();

        setDisplayedEvents((prev) =>
            prev.filter((event) => event.id !== selectedEvent.id)
        );

        setShowDeleteModal(false);
        setSelectedEvent(null);
    };

    const freeEventsCount = newEvents.filter((event) => event.price === "Free").length;
    const paidEventsCount = newEvents.length - freeEventsCount;

    useEffect(() => {
        savePreferredView("cards");
    }, []);

    useEffect(() => {
        if (EVENTS_CARDS_MODE !== "pagination") return;
        saveLastPage(currentPage);
    }, [currentPage]);

    const loadPageForPaginationMode = useCallback(async (page: number) => {
        try {
            setIsInitialLoading(true);

            const pageData = await fetchEventsPage(page, eventsPerPage);

            setDisplayedEvents(pageData.items);
            setTotalPages(pageData.totalPages);
        } catch (error) {
            console.error("Failed to load paginated events page:", error);
        } finally {
            setIsInitialLoading(false);
        }
    }, []);

    const loadInitialInfinitePage = useCallback(async () => {
        try {
            setIsInitialLoading(true);

            const pageData = await fetchEventsPage(1, eventsPerPage);

            setDisplayedEvents(pageData.items);
            setTotalPages(pageData.totalPages);
        } catch (error) {
            console.error("Failed to load initial events page:", error);
        } finally {
            setIsInitialLoading(false);
        }
    }, []);

    const prefetchNextPage = useCallback(
        async (page: number) => {
            if (page > totalPages) return;

            try {
                const pageData = await fetchEventsPage(page, eventsPerPage);
                setPrefetchedPage({
                    page,
                    items: pageData.items,
                });
            } catch (error) {
                console.error("Failed to prefetch next events page:", error);
            }
        },
        [totalPages]
    );

    const loadNextPage = useCallback(async () => {
        if (EVENTS_CARDS_MODE !== "infinite") return;
        if (isLoadingMore || isInitialLoading) return;
        if (currentPage >= totalPages) return;

        const nextPage = currentPage + 1;
        setIsLoadingMore(true);

        try {
            let nextItems: EventItem[] = [];

            if (prefetchedPage && prefetchedPage.page === nextPage) {
                nextItems = prefetchedPage.items;
                setPrefetchedPage(null);
            } else {
                const pageData = await fetchEventsPage(nextPage, eventsPerPage);
                nextItems = pageData.items;
            }

            setDisplayedEvents((prev) => {
                const existingIds = new Set(prev.map((event) => event.id));
                const uniqueNextItems = nextItems.filter(
                    (event) => !existingIds.has(event.id)
                );

                return [...prev, ...uniqueNextItems];
            });

            setCurrentPage(nextPage);
        } catch (error) {
            console.error("Failed to load next events page:", error);
        } finally {
            setIsLoadingMore(false);
        }
    }, [
        currentPage,
        totalPages,
        isLoadingMore,
        isInitialLoading,
        prefetchedPage,
    ]);

    useEffect(() => {
        if (EVENTS_CARDS_MODE !== "pagination") return;
        loadPageForPaginationMode(currentPage);
    }, [currentPage, loadPageForPaginationMode]);

    useEffect(() => {
        if (EVENTS_CARDS_MODE !== "infinite") return;
        loadInitialInfinitePage();
    }, [loadInitialInfinitePage]);

    useEffect(() => {
        if (EVENTS_CARDS_MODE !== "infinite") return;

        if (currentPage < totalPages) {
            prefetchNextPage(currentPage + 1);
        }
    }, [currentPage, totalPages, prefetchNextPage]);

    useEffect(() => {
        if (EVENTS_CARDS_MODE !== "infinite") return;
        if (!loadMoreTriggerRef.current) return;

        observerRef.current = new IntersectionObserver(
            (entries) => {
                const firstEntry = entries[0];

                if (firstEntry.isIntersecting) {
                    loadNextPage();
                }
            },
            {
                root: null,
                rootMargin: "300px",
                threshold: 0.1,
            }
        );

        observerRef.current.observe(loadMoreTriggerRef.current);

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, [loadNextPage]);

    useEffect(() => {
        setDisplayedEvents((prev) =>
            prev.map((displayedEvent) => {
                const updatedEvent = newEvents.find(
                    (event) => event.id === displayedEvent.id
                );
                return updatedEvent ?? displayedEvent;
            })
        );
    }, [newEvents]);

    const showStartIndex =
        EVENTS_CARDS_MODE === "pagination"
            ? (currentPage - 1) * eventsPerPage + 1
            : 1;

    const showEndIndex =
        EVENTS_CARDS_MODE === "pagination"
            ? Math.min(currentPage * eventsPerPage, newEvents.length)
            : displayedEvents.length;

    return (
        <div className="app-shell page events-page-shell">
            <Navbar />

            <SectionPageLayout
                pageClassName="events-cards-page"
                eyebrow="Curated Events"
                title="Events"
                description="Explore featured experiences in a visual layout, browse quickly, and manage the events your users will discover first."
                actions={
                    <>
                        <button
                            className="toggle-views-button"
                            onClick={() => navigate("/events-table")}
                            aria-label="Switch View"
                            type="button"
                        >
                            Switch to Table View
                        </button>

                        <RequirePermission permission="events:create">
                        <button
                            className="add-event-button"
                            onClick={() => navigate("/add-event")}
                            aria-label="Add event"
                            type="button"
                        >
                            +
                        </button>
                        </RequirePermission>
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
                <section className="cards-panel">
                    <div className="cards-panel-header">
                        <div>
                            <p className="panel-kicker">Collection</p>
                            <h2 className="panel-title">Event Gallery</h2>
                        </div>

                        <p className="panel-meta">
                            Mode:{" "}
                            {EVENTS_CARDS_MODE === "pagination"
                                ? "Pagination"
                                : "Infinite Scroll"}{" "}
                            • Showing {showStartIndex}–{showEndIndex} of {newEvents.length}
                        </p>
                    </div>

                    {isInitialLoading ? (
                        <div className="infinite-scroll-status">Loading events...</div>
                    ) : (
                        <>
                            <section className="cards-grid-container">
                                {displayedEvents.map((event) => (
                                    <EventCard
                                        key={event.id}
                                        event={event}
                                        onView={() => navigate(`/event-details/${event.id}`)}
                                        onEdit={() => navigate(`/edit-event/${event.id}`)}
                                        onDelete={handleOpenDeleteModal}
                                    />
                                ))}
                            </section>

                            {EVENTS_CARDS_MODE === "pagination" ? (
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
                            ) : (
                                <>
                                    <div
                                        ref={loadMoreTriggerRef}
                                        className="infinite-scroll-trigger"
                                    />

                                    <div className="infinite-scroll-footer">
                                        {isLoadingMore ? (
                                            <p className="infinite-scroll-status">
                                                Loading more events...
                                            </p>
                                        ) : currentPage < totalPages ? (
                                            <p className="infinite-scroll-status">
                                                Scroll to load more
                                            </p>
                                        ) : (
                                            <p className="infinite-scroll-status">
                                                You’ve reached the end
                                            </p>
                                        )}
                                    </div>
                                </>
                            )}
                        </>
                    )}
                </section>
            </SectionPageLayout>

            {showDeleteModal && selectedEvent && (
                <div className="modal-overlay">
                    <div className="delete-modal">
                        <p className="delete-modal-text">
                            Are you sure you want to delete <strong>{selectedEvent.title}</strong>?
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

export default EventsCardsPage;