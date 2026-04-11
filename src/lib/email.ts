import nodemailer from 'nodemailer';
import { completedEmailTemplate, cancelledEmailTemplate } from './emailTemplates';

const GMAIL_USER = process.env.GMAIL_USER;
const GMAIL_APP_PASSWORD = process.env.GMAIL_APP_PASSWORD;

/** Create a reusable transporter using Zoho Mail SMTP */
function getTransporter() {
    if (!GMAIL_USER || !GMAIL_APP_PASSWORD) {
        throw new Error('Zoho Mail credentials not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD in .env.local');
    }

    return nodemailer.createTransport({
        host: 'smtp.zoho.in',
        port: 465,
        secure: true,
        auth: {
            user: GMAIL_USER,
            pass: GMAIL_APP_PASSWORD,
        },
    });
}

interface SendEmailOptions {
    to: string;
    subject: string;
    html: string;
}

async function sendEmail({ to, subject, html }: SendEmailOptions): Promise<void> {
    const transporter = getTransporter();

    await transporter.sendMail({
        from: `"Uncharted Travel" <${GMAIL_USER}>`,
        replyTo: `"Uncharted Travel" <${GMAIL_USER}>`,
        to,
        subject,
        html,
    });

    console.log(`Email sent to ${to}: ${subject}`);
}

/**
 * Send a congratulations email when a booking is completed.
 */
export async function sendBookingCompletedEmail(
    to: string,
    userName: string,
    trekTitle: string,
    xpAwarded: number = 250
): Promise<void> {
    const subject = `🎉 Congratulations! You've completed ${trekTitle}`;
    const html = completedEmailTemplate(userName, trekTitle, xpAwarded);
    await sendEmail({ to, subject, html });
}

/**
 * Send a supportive email when a booking is cancelled.
 */
export async function sendBookingCancelledEmail(
    to: string,
    userName: string,
    trekTitle: string
): Promise<void> {
    const subject = `Your ${trekTitle} booking has been cancelled`;
    const html = cancelledEmailTemplate(userName, trekTitle);
    await sendEmail({ to, subject, html });
}
