import {
    createContext,
    useContext,
    useEffect,
    useState,
    ReactNode,
} from "react";
import {
    loginRequest,
    registerRequest,
    type LoggedInUser,
} from "../services/authApi";

type AuthContextType = {
    currentUser: LoggedInUser | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => void;
    hasPermission: (permission: string) => boolean;
    hasRole: (role: string) => boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "happening_current_user";
const TOKEN_STORAGE_KEY = "happening_auth_token";

export function AuthProvider({ children }: { children: ReactNode }) {
    const [currentUser, setCurrentUser] = useState<LoggedInUser | null>(null);

    const INACTIVITY_TIMEOUT_MS = 15 * 60 * 1000; // test: 30 seconds

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem(AUTH_STORAGE_KEY);
        localStorage.removeItem(TOKEN_STORAGE_KEY);
    };

    useEffect(() => {
        const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);

        if (!storedUser) {
            return;
        }

        try {
            setCurrentUser(JSON.parse(storedUser));
        } catch {
            localStorage.removeItem(AUTH_STORAGE_KEY);
            localStorage.removeItem(TOKEN_STORAGE_KEY);
        }
    }, []);

    useEffect(() => {
        if (!currentUser) {
            return;
        }

        let timeoutId: number;

        const resetTimer = () => {
            window.clearTimeout(timeoutId);

            timeoutId = window.setTimeout(() => {
                logout();
            }, INACTIVITY_TIMEOUT_MS);
        };

        const activityEvents = [
            "mousemove",
            "mousedown",
            "keydown",
            "scroll",
            "touchstart",
        ];

        activityEvents.forEach((eventName) => {
            window.addEventListener(eventName, resetTimer);
        });

        resetTimer();

        return () => {
            window.clearTimeout(timeoutId);

            activityEvents.forEach((eventName) => {
                window.removeEventListener(eventName, resetTimer);
            });
        };
    }, [currentUser]);

    const login = async (email: string, password: string) => {
        const response = await loginRequest(email, password);

        setCurrentUser(response.user);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response.user));
        localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
    };

    const register = async (name: string, email: string, password: string) => {
        const response = await registerRequest(name, email, password);

        setCurrentUser(response.user);
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response.user));
        localStorage.setItem(TOKEN_STORAGE_KEY, response.token);
    };

    const hasPermission = (permission: string) => {
        return currentUser?.permissions.includes(permission) ?? false;
    };

    const hasRole = (role: string) => {
        return currentUser?.roles.includes(role) ?? false;
    };

    return (
        <AuthContext.Provider
            value={{
                currentUser,
                isAuthenticated: currentUser !== null,
                login,
                register,
                logout,
                hasPermission,
                hasRole,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth must be used inside AuthProvider");
    }

    return context;
}