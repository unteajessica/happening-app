import "./styles/chat-page.css";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import Navbar from "../components/NavBar";
import { useAuth } from "../context/AuthContext";
import {
    fetchChatMessages,
    deleteChatMessages,
    type ChatMessageItem,
} from "../services/chatApi";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

function ChatPage() {
    const { currentUser, hasPermission } = useAuth();

    const [messages, setMessages] = useState<ChatMessageItem[]>([]);
    const [messageText, setMessageText] = useState("");
    const [error, setError] = useState("");

    const socketRef = useRef<Socket | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const loadMessages = async () => {
            try {
                setError("");
                const existingMessages = await fetchChatMessages();
                setMessages(existingMessages);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError("Failed to load chat messages.");
                }
            }
        };

        loadMessages();
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("happening_auth_token");

        const socket = io(BASE_URL, {
            auth: {
                token,
            },
        });

        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("Connected to chat socket:", socket.id);
        });

        socket.on("chat:new-message", (newMessage: ChatMessageItem) => {
            setMessages((previousMessages) => [...previousMessages, newMessage]);
        });

        socket.on("chat:cleared", () => {
            setMessages([]);
        });

        socket.on("chat:error", (payload: { message: string }) => {
            setError(payload.message);
        });

        socket.on("disconnect", () => {
            console.log("Disconnected from chat socket");
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const handleSendMessage = () => {
        if (!currentUser) {
            setError("You must be logged in to send messages.");
            return;
        }

        if (!hasPermission("chat:use")) {
            setError("You do not have permission to use chat.");
            return;
        }

        const trimmedMessage = messageText.trim();

        if (!trimmedMessage) {
            return;
        }

        socketRef.current?.emit("chat:send-message", {
            roomId: "global",
            message: trimmedMessage,
        });

        setMessageText("");
    };

    const handleDeleteChat = async () => {
        const confirmed = window.confirm(
            "Are you sure you want to delete all chat messages?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");
            await deleteChatMessages();
            setMessages([]);
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError("Failed to delete chat messages.");
            }
        }
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSendMessage();
        }
    };

    if (!currentUser) {
        return (
            <div className="app-shell">
                <Navbar />
                <main className="chat-page">
                    <section className="chat-card">
                        <h1>Chat</h1>
                        <p>You must be logged in to use the chat.</p>
                    </section>
                </main>
            </div>
        );
    }

    if (!hasPermission("chat:use")) {
        return (
            <div className="app-shell">
                <Navbar />
                <main className="chat-page">
                    <section className="chat-card">
                        <h1>Access denied</h1>
                        <p>You do not have permission to use the chat.</p>
                    </section>
                </main>
            </div>
        );
    }

    return (
        <div className="app-shell">
            <Navbar />

            <main className="chat-page">
                <section className="chat-card">
                    <div className="chat-header">
                        <div>
                            <p className="chat-kicker">Live room</p>
                            <h1>Happening Chat</h1>
                            <p className="chat-description">
                                Talk with other users in real time. Messages are saved in MongoDB.
                            </p>
                        </div>

                        <div className="chat-header-actions">
                            {hasPermission("chat:delete") && (
                                <button
                                    type="button"
                                    className="chat-delete-button"
                                    onClick={handleDeleteChat}
                                >
                                    Delete chat
                                </button>
                            )}

                            <div className="chat-user-pill">
                                {currentUser.name}
                            </div>
                        </div>
                    </div>

                    {error && <p className="chat-error">{error}</p>}

                    <div className="chat-messages">
                        {messages.length === 0 ? (
                            <p className="chat-empty">No messages yet. Start the conversation!</p>
                        ) : (
                            messages.map((message) => {
                                const isOwnMessage = message.userId === currentUser.id;

                                return (
                                    <div
                                        key={message.id}
                                        className={`chat-message ${
                                            isOwnMessage ? "chat-message-own" : ""
                                        }`}
                                    >
                                        <div className="chat-message-meta">
                                            <span>{message.userName}</span>
                                            <span>
                                                {new Date(message.createdAt).toLocaleString()}
                                            </span>
                                        </div>

                                        <p>{message.message}</p>
                                    </div>
                                );
                            })
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    <div className="chat-input-row">
                        <input
                            type="text"
                            className="chat-input"
                            placeholder="Write a message..."
                            value={messageText}
                            onChange={(event) => setMessageText(event.target.value)}
                            onKeyDown={handleKeyDown}
                        />

                        <button
                            type="button"
                            className="chat-send-button"
                            onClick={handleSendMessage}
                        >
                            Send
                        </button>
                    </div>
                </section>
            </main>
        </div>
    );
}

export default ChatPage;