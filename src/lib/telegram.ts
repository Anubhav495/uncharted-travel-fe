const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

interface BookingNotification {
    name: string;
    email: string;
    phone: string;
    date: string;
    guests: number;
    trekTitle: string;
    bookingId: string;
}

export async function sendBookingNotification(booking: BookingNotification) {
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        console.warn('Telegram credentials not configured, skipping notification.');
        return;
    }

    const message = `
🏔️ <b>New Booking Alert!</b>

<b>Trek:</b> ${escapeHtml(booking.trekTitle)}
<b>Name:</b> ${escapeHtml(booking.name)}
<b>Email:</b> ${escapeHtml(booking.email)}
<b>Phone:</b> ${escapeHtml(booking.phone)}
<b>Date:</b> ${escapeHtml(booking.date)}
<b>Guests:</b> ${booking.guests}
<b>Booking ID:</b> <code>${booking.bookingId}</code>

📅 <i>${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</i>
    `.trim();

    try {
        const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: TELEGRAM_CHAT_ID,
                text: message,
                parse_mode: 'HTML',
            }),
        });

        if (!response.ok) {
            const error = await response.json();
            console.error('Telegram API error:', error);
        } else {
            console.log('Telegram notification sent successfully.');
        }
    } catch (error) {
        // Don't let notification failure break the booking flow
        console.error('Failed to send Telegram notification:', error);
    }
}

/**
 * Escape special characters for Telegram HTML format
 */
function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');
}
