import "dotenv/config";
import { sendEmail } from "./services/email.service";

async function testEmail() {
    await sendEmail({
        to: process.env.EMAIL_USER!,
        subject: "Happening email test",
        text: "If you received this email, Nodemailer works.",
        html: "<h2>Happening email test</h2><p>If you received this email, Nodemailer works.</p>",
    });

    console.log("Test email sent successfully.");
}

testEmail().catch((error) => {
    console.error("Failed to send test email:", error);
});