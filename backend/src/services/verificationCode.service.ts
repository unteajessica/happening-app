import { prisma } from "../db/prisma";

const CODE_EXPIRATION_MINUTES = 10;

export type VerificationCodePurpose = "LOGIN" | "PASSWORD_RESET";

export function generateVerificationCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function createVerificationCode(
    userId: number,
    email: string,
    purpose: VerificationCodePurpose
) {
    await prisma.authVerificationCode.updateMany({
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

    const expiresAt = new Date(
        Date.now() + CODE_EXPIRATION_MINUTES * 60 * 1000
    );

    await prisma.authVerificationCode.create({
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

export async function verifyVerificationCode(
    email: string,
    code: string,
    purpose: VerificationCodePurpose
) {
    const verificationCode = await prisma.authVerificationCode.findFirst({
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

    await prisma.authVerificationCode.update({
        where: {
            id: verificationCode.id,
        },
        data: {
            used: true,
        },
    });

    return verificationCode;
}