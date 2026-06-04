import dns from "dns";
import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

dns.setDefaultResultOrder("ipv4first");

type SendEmailOptions = {
    to: string;
    subject: string;
    text: string;
    html?: string;
};

function getEmailTransporter() {
    const host = process.env.EMAIL_HOST;
    const port = Number(process.env.EMAIL_PORT);
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;

    if (!host || !port || !user || !pass) {
        throw new Error("Email environment variables are missing.");
    }

    const transportOptions = {
        host,
        port,
        secure: port === 465,
        family: 4,
        auth: {
            user,
            pass,
        },
        tls: {
            rejectUnauthorized: true,
        },
    } as SMTPTransport.Options & { family: number };

    return nodemailer.createTransport(transportOptions);
}

export async function sendEmail(options: SendEmailOptions) {
    const from = process.env.EMAIL_FROM;

    if (!from) {
        throw new Error("EMAIL_FROM is missing from .env.");
    }

    const transporter = getEmailTransporter();

    await transporter.sendMail({
        from,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html,
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