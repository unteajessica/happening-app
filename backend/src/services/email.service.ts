import { BrevoClient } from "@getbrevo/brevo";

type SendEmailOptions = {
    to: string;
    subject: string;
    text: string;
    html?: string;
};

function getBrevoClient() {
    const apiKey = process.env.BREVO_API_KEY;

    if (!apiKey) {
        throw new Error("BREVO_API_KEY is missing.");
    }

    return new BrevoClient({
        apiKey,
    });
}

function getSender() {
    const from = process.env.EMAIL_FROM;

    if (!from) {
        throw new Error("EMAIL_FROM is missing.");
    }

    return {
        email: from,
        name: "Happening App",
    };
}

export async function sendEmail(options: SendEmailOptions) {
    const client = getBrevoClient();

    await client.transactionalEmails.sendTransacEmail({
        sender: getSender(),
        to: [
            {
                email: options.to,
            },
        ],
        subject: options.subject,
        textContent: options.text,
        htmlContent: options.html ?? options.text,
    });
}

export async function sendLoginCodeEmail(email: string, code: string) {
    await sendEmail({
        to: email,
        subject: "Your Happening login verification code",
        text: `Your Happening login verification code is: ${code}. It expires in 10 minutes.`,
        html: `
            <h2>Happening Login Verification</h2>
            <p>Your verification code is:</p>
            <h1>${code}</h1>
            <p>This code expires in 10 minutes.</p>
        `,
    });
}

export async function sendPasswordResetCodeEmail(email: string, code: string) {
    await sendEmail({
        to: email,
        subject: "Your Happening password reset code",
        text: `Your Happening password reset code is: ${code}. It expires in 10 minutes.`,
        html: `
            <h2>Happening Password Reset</h2>
            <p>Your password reset code is:</p>
            <h1>${code}</h1>
            <p>This code expires in 10 minutes.</p>
        `,
    });
}