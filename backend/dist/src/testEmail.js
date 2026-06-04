"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const email_service_1 = require("./services/email.service");
async function testEmail() {
    await (0, email_service_1.sendEmail)({
        to: process.env.EMAIL_USER,
        subject: "Happening email test",
        text: "If you received this email, Nodemailer works.",
        html: "<h2>Happening email test</h2><p>If you received this email, Nodemailer works.</p>",
    });
    console.log("Test email sent successfully.");
}
testEmail().catch((error) => {
    console.error("Failed to send test email:", error);
});
