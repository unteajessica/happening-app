import "./styles/observation-list-page.css";
import { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import { useAuth } from "../context/AuthContext";
import {
    dismissSuspiciousUser,
    fetchActionLogs,
    fetchSuspiciousUsers,
    reviewSuspiciousUser,
    type ActionLogItem,
    type SuspiciousUserItem,
} from "../services/logsApi";

function formatDate(date: string) {
    return new Date(date).toLocaleString();
}

function ObservationListPage() {
    const { hasPermission } = useAuth();

    const [suspiciousUsers, setSuspiciousUsers] = useState<SuspiciousUserItem[]>([]);
    const [actionLogs, setActionLogs] = useState<ActionLogItem[]>([]);
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(true);

    const canReadSuspiciousUsers = hasPermission("suspicious-users:read");
    const canUpdateSuspiciousUsers = hasPermission("suspicious-users:update");
    const canReadLogs = hasPermission("logs:read");

    const loadObservationData = async () => {
        try {
            setError("");
            setIsLoading(true);

            const [suspiciousUsersData, actionLogsData] = await Promise.all([
                fetchSuspiciousUsers(),
                fetchActionLogs(),
            ]);

            setSuspiciousUsers(suspiciousUsersData);
            setActionLogs(actionLogsData);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Failed to load observation data.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (canReadSuspiciousUsers && canReadLogs) {
            loadObservationData();
        } else {
            setIsLoading(false);
        }
    }, [canReadSuspiciousUsers, canReadLogs]);

    const handleReview = async (id: number) => {
        try {
            const updatedUser = await reviewSuspiciousUser(id);

            setSuspiciousUsers((previousUsers) =>
                previousUsers.map((user) =>
                    user.id === updatedUser.id ? updatedUser : user
                )
            );
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Failed to review suspicious user.");
            }
        }
    };

    const handleDismiss = async (id: number) => {
        try {
            const updatedUser = await dismissSuspiciousUser(id);

            setSuspiciousUsers((previousUsers) =>
                previousUsers.map((user) =>
                    user.id === updatedUser.id ? updatedUser : user
                )
            );
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Failed to dismiss suspicious user.");
            }
        }
    };

    if (!canReadSuspiciousUsers || !canReadLogs) {
        return (
            <div className="app-shell">
                <Navbar />
                <main className="observation-page">
                    <section className="observation-card">
                        <p className="observation-kicker">Restricted</p>
                        <h1>Access denied</h1>
                        <p>You do not have permission to view the observation list.</p>
                    </section>
                </main>
            </div>
        );
    }

    return (
        <div className="app-shell">
            <Navbar />

            <main className="observation-page">
                <section className="observation-hero">
                    <p className="observation-kicker">Admin monitoring</p>
                    <h1>Observation List</h1>
                    <p>
                        Review suspicious users and recent actions detected by the logging
                        system.
                    </p>
                </section>

                {error && <p className="observation-error">{error}</p>}

                {isLoading ? (
                    <section className="observation-card">
                        <p>Loading observation data...</p>
                    </section>
                ) : (
                    <>
                        <section className="observation-card">
                            <div className="observation-card-header">
                                <div>
                                    <p className="observation-kicker">Suspicious activity</p>
                                    <h2>Suspicious Users</h2>
                                </div>

                                <span className="observation-count">
                                    {suspiciousUsers.length} records
                                </span>
                            </div>

                            {suspiciousUsers.length === 0 ? (
                                <p className="observation-empty">
                                    No suspicious users detected yet.
                                </p>
                            ) : (
                                <div className="observation-table-wrap">
                                    <table className="observation-table">
                                        <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Reason</th>
                                                <th>Score</th>
                                                <th>Status</th>
                                                <th>Detected</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {suspiciousUsers.map((user) => (
                                                <tr key={user.id}>
                                                    <td>
                                                        <strong>
                                                            {user.userName || "Unknown"}
                                                        </strong>
                                                        <span>{user.userEmail || "—"}</span>
                                                    </td>
                                                    <td>{user.reason}</td>
                                                    <td>{user.score}</td>
                                                    <td>
                                                        <span
                                                            className={`status-pill status-${user.status.toLowerCase()}`}
                                                        >
                                                            {user.status}
                                                        </span>
                                                    </td>
                                                    <td>{formatDate(user.createdAt)}</td>
                                                    <td>
                                                        <div className="observation-actions">
                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    !canUpdateSuspiciousUsers ||
                                                                    user.status === "REVIEWED"
                                                                }
                                                                onClick={() =>
                                                                    handleReview(user.id)
                                                                }
                                                            >
                                                                Review
                                                            </button>

                                                            <button
                                                                type="button"
                                                                disabled={
                                                                    !canUpdateSuspiciousUsers ||
                                                                    user.status === "DISMISSED"
                                                                }
                                                                onClick={() =>
                                                                    handleDismiss(user.id)
                                                                }
                                                            >
                                                                Dismiss
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>

                        <section className="observation-card">
                            <div className="observation-card-header">
                                <div>
                                    <p className="observation-kicker">Audit trail</p>
                                    <h2>Recent Action Logs</h2>
                                </div>

                                <span className="observation-count">
                                    {actionLogs.length} logs
                                </span>
                            </div>

                            {actionLogs.length === 0 ? (
                                <p className="observation-empty">
                                    No action logs recorded yet.
                                </p>
                            ) : (
                                <div className="observation-table-wrap">
                                    <table className="observation-table">
                                        <thead>
                                            <tr>
                                                <th>User</th>
                                                <th>Role</th>
                                                <th>Action</th>
                                                <th>Entity</th>
                                                <th>Information</th>
                                                <th>Time</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {actionLogs.map((log) => (
                                                <tr key={log.id}>
                                                    <td>
                                                        <strong>
                                                            {log.userName || "Unknown"}
                                                        </strong>
                                                        <span>{log.userEmail || "—"}</span>
                                                    </td>
                                                    <td>{log.userRoleName || "—"}</td>
                                                    <td>
                                                        <span className="action-pill">
                                                            {log.action}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {log.entityType || "—"}
                                                        {log.entityId
                                                            ? ` #${log.entityId}`
                                                            : ""}
                                                    </td>
                                                    <td>{log.information}</td>
                                                    <td>{formatDate(log.createdAt)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </section>
                    </>
                )}
            </main>
        </div>
    );
}

export default ObservationListPage;