"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = sendEmail;
exports.sendLoginCodeEmail = sendLoginCodeEmail;
exports.sendPasswordResetCodeEmail = sendPasswordResetCodeEmail;
const nodemailer_1 = __importDefault(require("nodemailer"));
function getEmailTransporter() {
    const host = process.env.EMAIL_HOST;
    const port = Number(process.env.EMAIL_PORT);
    const user = process.env.EMAIL_USER;
    const pass = process.env.EMAIL_PASS;
    if (!host || !port || !user || !pass) {
        throw new Error("Email environment variables are missing.");
    }
    return nodemailer_1.default.createTransport({
        host,
        port,
        secure: port === 465,
        auth: {
            user,
            pass,
        },
    });
}
async function sendEmail(options) {
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
async function sendLoginCodeEmail(email, code) {
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
async function sendPasswordResetCodeEmail(email, code) {
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
