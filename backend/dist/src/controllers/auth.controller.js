"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.register = exports.verifyLogin = exports.login = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma_1 = require("../db/prisma");
const log_service_1 = require("../services/log.service");
const authToken_1 = require("../utils/authToken");
const verificationCode_service_1 = require("../services/verificationCode.service");
const email_service_1 = require("../services/email.service");
function extractRolesAndPermissions(user) {
    const roles = user.userRoles.map((userRole) => userRole.role.name);
    const permissions = Array.from(new Set(user.userRoles.flatMap((userRole) => userRole.role.rolePermissions.map((rolePermission) => rolePermission.permission.name))));
    return {
        roles,
        permissions,
    };
}
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            await (0, log_service_1.createActionLog)({
                action: "LOGIN_FAILED",
                information: "Login failed because email or password was missing.",
                ipAddress: req.ip,
            });
            return res.status(400).json({
                message: "Email and password are required.",
            });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const user = await prisma_1.prisma.user.findUnique({
            where: {
                email: normalizedEmail,
            },
        });
        if (!user) {
            await (0, log_service_1.createActionLog)({
                action: "LOGIN_FAILED",
                information: `Login failed for unknown email: ${normalizedEmail}`,
                ipAddress: req.ip,
            });
            return res.status(401).json({
                message: "Invalid email or password.",
            });
        }
        const passwordMatches = await bcrypt_1.default.compare(password, user.passwordHash);
        if (!passwordMatches) {
            await (0, log_service_1.createActionLog)({
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
        const verificationCode = await (0, verificationCode_service_1.createVerificationCode)(user.id, user.email, "LOGIN");
        await (0, email_service_1.sendLoginCodeEmail)(user.email, verificationCode);
        await (0, log_service_1.createActionLog)({
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
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to login.",
            error,
        });
    }
};
exports.login = login;
const verifyLogin = async (req, res) => {
    try {
        const { email, code } = req.body;
        if (!email || !code) {
            return res.status(400).json({
                message: "Email and verification code are required.",
            });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const verificationCode = await (0, verificationCode_service_1.verifyVerificationCode)(normalizedEmail, code, "LOGIN");
        if (!verificationCode) {
            return res.status(400).json({
                message: "Invalid or expired verification code.",
            });
        }
        const user = await prisma_1.prisma.user.findUnique({
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
        const token = (0, authToken_1.createAuthToken)({
            userId: user.id,
            email: user.email,
            roles,
            permissions,
        });
        await (0, log_service_1.createActionLog)({
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
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to verify login.",
            error,
        });
    }
};
exports.verifyLogin = verifyLogin;
const register = async (req, res) => {
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
        const existingUser = await prisma_1.prisma.user.findUnique({
            where: {
                email: normalizedEmail,
            },
        });
        if (existingUser) {
            return res.status(400).json({
                message: "An account with this email already exists.",
            });
        }
        const userRole = await prisma_1.prisma.appRole.findUnique({
            where: {
                name: "USER",
            },
        });
        if (!userRole) {
            return res.status(500).json({
                message: "Default USER role was not found. Please seed the database.",
            });
        }
        const passwordHash = await bcrypt_1.default.hash(password, 10);
        const newUser = await prisma_1.prisma.user.create({
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
        await (0, log_service_1.createActionLog)({
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
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to register.",
            error,
        });
    }
};
exports.register = register;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({
                message: "Email is required.",
            });
        }
        const normalizedEmail = email.trim().toLowerCase();
        const user = await prisma_1.prisma.user.findUnique({
            where: {
                email: normalizedEmail,
            },
        });
        if (!user) {
            return res.json({
                message: "If an account with this email exists, a password reset code was sent.",
            });
        }
        const resetCode = await (0, verificationCode_service_1.createVerificationCode)(user.id, user.email, "PASSWORD_RESET");
        await (0, email_service_1.sendPasswordResetCodeEmail)(user.email, resetCode);
        await (0, log_service_1.createActionLog)({
            userId: user.id,
            action: "PASSWORD_RESET_CODE_SENT",
            entityType: "User",
            entityId: user.id,
            information: `Password reset code sent to ${user.email}.`,
            ipAddress: req.ip,
        });
        return res.json({
            message: "If an account with this email exists, a password reset code was sent.",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to request password reset.",
            error,
        });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
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
        const verificationCode = await (0, verificationCode_service_1.verifyVerificationCode)(normalizedEmail, code, "PASSWORD_RESET");
        if (!verificationCode) {
            return res.status(400).json({
                message: "Invalid or expired password reset code.",
            });
        }
        const user = await prisma_1.prisma.user.findUnique({
            where: {
                email: normalizedEmail,
            },
        });
        if (!user) {
            return res.status(404).json({
                message: "User not found.",
            });
        }
        const passwordHash = await bcrypt_1.default.hash(newPassword, 10);
        await prisma_1.prisma.user.update({
            where: {
                id: user.id,
            },
            data: {
                passwordHash,
            },
        });
        await (0, log_service_1.createActionLog)({
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
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to reset password.",
            error,
        });
    }
};
exports.resetPassword = resetPassword;
