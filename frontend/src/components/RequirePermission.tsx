import { ReactNode } from "react";
import { useAuth } from "../context/AuthContext";

type RequirePermissionProps = {
    permission: string;
    children: ReactNode;
    fallback?: ReactNode;
};

function RequirePermission({
    permission,
    children,
    fallback = null,
}: RequirePermissionProps) {
    const { hasPermission } = useAuth();

    if (!hasPermission(permission)) {
        return <>{fallback}</>;
    }

    return <>{children}</>;
}

export default RequirePermission;