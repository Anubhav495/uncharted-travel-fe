import nodemailer from 'nodemailer';
import {
    completedEmailTemplate,
    cancelledEmailTemplate,
    reachOutEmailTemplate,
    guideAssignmentEmailTemplate,
    type GuideAssignmentEmailData,
} from './emailTemplates';

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

    try {
        await transporter.sendMail({
            from: `"Uncharted Travel" <${GMAIL_USER}>`,
            replyTo: `"Uncharted Travel" <${GMAIL_USER}>`,
            to,
            subject,
            html,
        });
        console.log(`Email sent to ${to}: ${subject}`);
    } catch (error) {
        console.error(`[Nodemailer Error] Failed to send email to ${to}:`, error);
        throw error; // Rethrow so the webhook handler can catch it
    }
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

/** Send a reach-out email asking the user to call back. */
export async function sendReachOutEmail(
    to: string,
    userName: string
): Promise<void> {
    const subject = 'Uncharted Travel - We tried to reach you!';
    const html = reachOutEmailTemplate(userName);
    await sendEmail({ to, subject, html });
}

/** Send the route, packing list, and confirmed guide details to a traveller. */
export async function sendGuideAssignmentEmail(to: string, details: GuideAssignmentEmailData): Promise<void> {
    const subject = `Meet your guide for ${details.trek.title} | Uncharted Travel`;
    const html = guideAssignmentEmailTemplate(details);
    await sendEmail({ to, subject, html });
}
