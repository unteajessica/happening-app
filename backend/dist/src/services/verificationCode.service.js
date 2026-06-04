"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateVerificationCode = generateVerificationCode;
exports.createVerificationCode = createVerificationCode;
exports.verifyVerificationCode = verifyVerificationCode;
const prisma_1 = require("../db/prisma");
const CODE_EXPIRATION_MINUTES = 10;
function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
async function createVerificationCode(userId, email, purpose) {
    await prisma_1.prisma.authVerificationCode.updateMany({
        where: {
            userId,
            purpose,
            used: false,
        },
        data: {
            used: true,
        },
    });
    const code = generateVerificationCode();
    const expiresAt = new Date(Date.now() + CODE_EXPIRATION_MINUTES * 60 * 1000);
    await prisma_1.prisma.authVerificationCode.create({
        data: {
            userId,
            email: email.trim().toLowerCase(),
            code,
            purpose,
            expiresAt,
        },
    });
    return code;
}
async function verifyVerificationCode(email, code, purpose) {
    const verificationCode = await prisma_1.prisma.authVerificationCode.findFirst({
        where: {
            email: email.trim().toLowerCase(),
            code: code.trim(),
            purpose,
            used: false,
            expiresAt: {
                gt: new Date(),
            },
        },
        orderBy: {
            createdAt: "desc",
        },
    });
    if (!verificationCode) {
        return null;
    }
    await prisma_1.prisma.authVerificationCode.update({
        where: {
            id: verificationCode.id,
        },
        data: {
            used: true,
        },
    });
    return verificationCode;
}
