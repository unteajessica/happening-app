import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../db/prisma";
import { createActionLog } from "../services/log.service";
import { createAuthToken } from "../utils/authToken";
import {
    createVerificationCode,
    verifyVerificationCode,
} from "../services/verificationCode.service";
import {
    sendLoginCodeEmail,
    sendPasswordResetCodeEmail,
} from "../services/email.service";

function extractRolesAndPermissions(user: any): {
    roles: string[];
    permissions: string[];
} {
    const roles: string[] = user.userRoles.map(
        (userRole: any) => userRole.role.name
    );

    const permissions: string[] = Array.from(
        new Set<string>(
            user.userRoles.flatMap((userRole: any) =>
                userRole.role.rolePermissions.map(
                    (rolePermission: any) => rolePermission.permission.name
                )
            )
        )
    );

    return {
        roles,
        permissions,
    };
}

export const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            await createActionLog({
                action: "LOGIN_FAILED",
                information: "Login failed because email or password was missing.",
                ipAddress: req.ip,
            });

            return res.status(400).json({
                message: "Email and password are required.",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await prisma.user.findUnique({
            where: {
                email: normalizedEmail,
            },
        });

        if (!user) {
            await createActionLog({
                action: "LOGIN_FAILED",
                information: `Login failed for unknown email: ${normalizedEmail}`,
                ipAddress: req.ip,
            });

            return res.status(401).json({
                message: "Invalid email or password.",
            });
        }

        const passwordMatches = await bcrypt.compare(password, user.passwordHash);

        if (!passwordMatches) {
            await createActionLog({
                userId: user.id,
                action: "LOGIN_FAILED",
                entityType: "User",
                entityId: user.id,
                information: `Login failed for user ${user.email}: wrong password.`,
                ipAddress: req.ip,
            });

            return res.status(401).json({
                message: "Invalid email or password.",
            });
        }

        const verificationCode = await createVerificationCode(
            user.id,
            user.email,
            "LOGIN"
        );

        await sendLoginCodeEmail(user.email, verificationCode);

        await createActionLog({
            userId: user.id,
            action: "LOGIN_CODE_SENT",
            entityType: "User",
            entityId: user.id,
            information: `Login verification code sent to ${user.email}.`,
            ipAddress: req.ip,
        });

        return res.json({
            message: "Verification code sent to your email.",
            requiresVerification: true,
            email: user.email,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to login.",
            error,
        });
    }
};

export const verifyLogin = async (req: Request, res: Response) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({
                message: "Email and verification code are required.",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const verificationCode = await verifyVerificationCode(
            normalizedEmail,
            code,
            "LOGIN"
        );

        if (!verificationCode) {
            return res.status(400).json({
                message: "Invalid or expired verification code.",
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                email: normalizedEmail,
            },
            include: {
                userRoles: {
                    include: {
                        role: {
                            include: {
                                rolePermissions: {
                                    include: {
                                        permission: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        const { roles, permissions } = extractRolesAndPermissions(user);

        const token = createAuthToken({
            userId: user.id,
            email: user.email,
            roles,
            permissions,
        });

        await createActionLog({
            userId: user.id,
            action: "LOGIN_SUCCESS",
            entityType: "User",
            entityId: user.id,
            information: `User ${user.email} completed email verification and logged in successfully.`,
            ipAddress: req.ip,
        });

        return res.json({
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                roles,
                permissions,
            },
            token,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to verify login.",
            error,
        });
    }
};

export const register = async (req: Request, res: Response) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({
                message: "Name, email and password are required.",
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                message: "Password must have at least 6 characters.",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const existingUser = await prisma.user.findUnique({
            where: {
                email: normalizedEmail,
            },
        });

        if (existingUser) {
            return res.status(400).json({
                message: "An account with this email already exists.",
            });
        }

        const userRole = await prisma.appRole.findUnique({
            where: {
                name: "USER",
            },
        });

        if (!userRole) {
            return res.status(500).json({
                message: "Default USER role was not found. Please seed the database.",
            });
        }

        const passwordHash = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name: name.trim(),
                email: normalizedEmail,
                passwordHash,
                role: "USER",
                userRoles: {
                    create: {
                        roleId: userRole.id,
                    },
                },
            },
            include: {
                userRoles: {
                    include: {
                        role: {
                            include: {
                                rolePermissions: {
                                    include: {
                                        permission: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        const { roles, permissions } = extractRolesAndPermissions(newUser);

        await createActionLog({
            userId: newUser.id,
            action: "REGISTER_SUCCESS",
            entityType: "User",
            entityId: newUser.id,
            information: `User ${newUser.email} registered successfully.`,
            ipAddress: req.ip,
        });

        return res.status(201).json({
            message: "Account created successfully. Please log in to verify your email.",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                roles,
                permissions,
            },
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to register.",
            error,
        });
    }
};

export const forgotPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                message: "Email is required.",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const user = await prisma.user.findUnique({
            where: {
                email: normalizedEmail,
            },
        });

        if (!user) {
            return res.json({
                message:
                    "If an account with this email exists, a password reset code was sent.",
            });
        }

        const resetCode = await createVerificationCode(
            user.id,
            user.email,
            "PASSWORD_RESET"
        );

        await sendPasswordResetCodeEmail(user.email, resetCode);

        await createActionLog({
            userId: user.id,
            action: "PASSWORD_RESET_CODE_SENT",
            entityType: "User",
            entityId: user.id,
            information: `Password reset code sent to ${user.email}.`,
            ipAddress: req.ip,
        });

        return res.json({
            message:
                "If an account with this email exists, a password reset code was sent.",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to request password reset.",
            error,
        });
    }
};

export const resetPassword = async (req: Request, res: Response) => {
    try {
        const { email, code, newPassword } = req.body;

        if (!email || !code || !newPassword) {
            return res.status(400).json({
                message: "Email, code and new password are required.",
            });
        }

        if (newPassword.length < 6) {
            return res.status(400).json({
                message: "Password must have at least 6 characters.",
            });
        }

        const normalizedEmail = email.trim().toLowerCase();

        const verificationCode = await verifyVerificationCode(
            normalizedEmail,
            code,
            "PASSWORD_RESET"
        );

        if (!verificationCode) {
            return res.status(400).json({
                message: "Invalid or expired password reset code.",
            });
        }

        const user = await prisma.user.findUnique({
            where: {
                email: normalizedEmail,
            },
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found.",
            });
        }

        const passwordHash = await bcrypt.hash(newPassword, 10);

        await prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                passwordHash,
            },
        });

        await createActionLog({
            userId: user.id,
            action: "PASSWORD_RESET_SUCCESS",
            entityType: "User",
            entityId: user.id,
            information: `User ${user.email} reset their password successfully.`,
            ipAddress: req.ip,
        });

        return res.json({
            message: "Password reset successfully.",
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to reset password.",
            error,
        });
    }
};