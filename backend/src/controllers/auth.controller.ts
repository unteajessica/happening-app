import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../db/prisma";
import { createActionLog } from "../services/log.service";
import { createAuthToken } from "../utils/authToken";

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

        const user = await prisma.user.findUnique({
            where: {
                email,
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
            await createActionLog({
                action: "LOGIN_FAILED",
                information: `Login failed for unknown email: ${email}`,
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

        const roles = user.userRoles.map((userRole) => userRole.role.name);

        const permissions = [
            ...new Set(
                user.userRoles.flatMap((userRole) =>
                    userRole.role.rolePermissions.map(
                        (rolePermission) => rolePermission.permission.name
                    )
                )
            ),
        ];

        await createActionLog({
            userId: user.id,
            action: "LOGIN_SUCCESS",
            entityType: "User",
            entityId: user.id,
            information: `User ${user.email} logged in successfully.`,
            ipAddress: req.ip,
        });

        const token = createAuthToken({
            userId: user.id,
            email: user.email,
            roles,
            permissions,
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
            message: "Failed to login.",
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

        const existingUser = await prisma.user.findUnique({
            where: {
                email,
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
                email: email.trim().toLowerCase(),
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

        const roles = newUser.userRoles.map((userRole) => userRole.role.name);

        const permissions = [
            ...new Set(
                newUser.userRoles.flatMap((userRole) =>
                    userRole.role.rolePermissions.map(
                        (rolePermission) => rolePermission.permission.name
                    )
                )
            ),
        ];

        await createActionLog({
            userId: newUser.id,
            action: "REGISTER_SUCCESS",
            entityType: "User",
            entityId: newUser.id,
            information: `User ${newUser.email} registered successfully.`,
            ipAddress: req.ip,
        });

        const token = createAuthToken({
            userId: newUser.id,
            email: newUser.email,
            roles,
            permissions,
        });

        return res.status(201).json({
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                roles,
                permissions,
            },
            token,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Failed to register.",
            error,
        });
    }
};