/**
 * Email HTML templates for booking status notifications.
 * Uses inline styles for maximum email client compatibility.
 */

const SITE_URL = 'https://unchartedtravel.in';

/** Shared base wrapper for all email templates */
function baseLayout(content: string): string {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Uncharted Travel</title>
</head>
<body style="margin:0;padding:0;background-color:#0f172a;font-family:'Segoe UI',Roboto,'Helvetica Neue',Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f172a;padding:40px 20px;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
                    <!-- Logo / Brand -->
                    <tr>
                        <td align="center" style="padding-bottom:32px;">
                            <a href="${SITE_URL}" style="text-decoration:none;">
                                <img src="${SITE_URL}/assets/brand-logo.png" alt="Uncharted Travel" width="48" height="48" style="display:inline-block;vertical-align:middle;width:48px;height:48px;margin-right:12px;" />
                                <span style="font-size:28px;font-weight:800;color:#facc15;letter-spacing:-0.5px;vertical-align:middle;">Uncharted Travel</span>
                            </a>
                        </td>
                    </tr>
                    <!-- Main Card -->
                    <tr>
                        <td style="background-color:#1e293b;border-radius:16px;border:1px solid #334155;overflow:hidden;">
                            ${content}
                        </td>
                    </tr>
                    <!-- Footer -->
                    <tr>
                        <td align="center" style="padding-top:32px;">
                            <p style="color:#64748b;font-size:13px;margin:0 0 8px 0;">
                                You're receiving this because you have a booking with Uncharted Travel.
                            </p>
                            <p style="color:#475569;font-size:12px;margin:0;">
                                <a href="${SITE_URL}" style="color:#facc15;text-decoration:none;">unchartedtravel.in</a>
                                &nbsp;·&nbsp; Himalayan Trekking Adventures
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>`.trim();
}

/** Email template for completed bookings */
export function completedEmailTemplate(userName: string, trekTitle: string, xpAwarded: number): string {
    const content = `
        <!-- Accent Bar -->
        <div style="height:4px;background:linear-gradient(90deg,#facc15,#f59e0b,#22c55e);"></div>

        <!-- Content -->
        <div style="padding:40px 36px;">
            <!-- Celebration Icon -->
            <div style="text-align:center;margin-bottom:24px;">
                <span style="font-size:56px;">🎉</span>
            </div>

            <h1 style="color:#ffffff;font-size:26px;font-weight:800;text-align:center;margin:0 0 8px 0;">
                Congratulations, ${escapeHtml(userName)}!
            </h1>

            <p style="color:#94a3b8;font-size:16px;text-align:center;margin:0 0 32px 0;line-height:1.6;">
                You've successfully completed your trek to <strong style="color:#facc15;">${escapeHtml(trekTitle)}</strong>. What an incredible adventure!
            </p>

            <!-- XP Badge -->
            <div style="background:linear-gradient(135deg,#422006,#713f12);border:1px solid #a16207;border-radius:12px;padding:20px;text-align:center;margin-bottom:32px;">
                <span style="font-size:14px;color:#fbbf24;text-transform:uppercase;letter-spacing:2px;font-weight:700;">XP Earned</span>
                <div style="font-size:36px;font-weight:900;color:#facc15;margin-top:4px;">+${xpAwarded} XP</div>
                <p style="color:#d97706;font-size:13px;margin:8px 0 0 0;">
                    Check your rank on the community leaderboard!
                </p>
            </div>

            <p style="color:#cbd5e1;font-size:15px;text-align:center;margin:0 0 32px 0;line-height:1.7;">
                We'd love to hear about your experience! Your feedback helps us and our guides improve the trekking experience for everyone.
            </p>

            <!-- CTA Buttons -->
            <div style="text-align:center;margin-bottom:16px;">
                <a href="${SITE_URL}/dashboard" style="display:inline-block;background-color:#facc15;color:#0f172a;font-size:16px;font-weight:700;padding:14px 32px;border-radius:12px;text-decoration:none;letter-spacing:0.3px;">
                    ⭐ Share Your Feedback
                </a>
            </div>
            <div style="text-align:center;">
                <a href="${SITE_URL}/community" style="display:inline-block;color:#facc15;font-size:14px;font-weight:600;text-decoration:none;padding:8px 16px;">
                    View Leaderboard →
                </a>
            </div>
        </div>
    `;

    return baseLayout(content);
}

/** Email template for cancelled bookings */
export function cancelledEmailTemplate(userName: string, trekTitle: string): string {
    const content = `
        <!-- Accent Bar -->
        <div style="height:4px;background:linear-gradient(90deg,#f59e0b,#ef4444,#f59e0b);"></div>

        <!-- Content -->
        <div style="padding:40px 36px;">
            <!-- Icon -->
            <div style="text-align:center;margin-bottom:24px;">
                <span style="font-size:56px;">🏔️</span>
            </div>

            <h1 style="color:#ffffff;font-size:26px;font-weight:800;text-align:center;margin:0 0 8px 0;">
                Hey ${escapeHtml(userName)},
            </h1>

            <p style="color:#94a3b8;font-size:16px;text-align:center;margin:0 0 28px 0;line-height:1.6;">
                We're sorry to know that you had to cancel your adventure to <strong style="color:#facc15;">${escapeHtml(trekTitle)}</strong>.
            </p>

            <!-- Encouragement Box -->
            <div style="background:linear-gradient(135deg,#1a1a2e,#16213e);border:1px solid #334155;border-radius:12px;padding:24px;text-align:center;margin-bottom:32px;">
                <p style="color:#e2e8f0;font-size:16px;font-weight:600;margin:0 0 8px 0;">
                    No worries — keep the energy up! 💪
                </p>
                <p style="color:#94a3b8;font-size:14px;margin:0;line-height:1.6;">
                    The mountains aren't going anywhere, and neither is your spirit of adventure. We'd love to see you try again when the time is right.
                </p>
            </div>

            <p style="color:#cbd5e1;font-size:15px;text-align:center;margin:0 0 32px 0;line-height:1.7;">
                If you have a moment, we'd really appreciate your feedback. It helps us improve and serve you better in the future.
            </p>

            <!-- CTA Buttons -->
            <div style="text-align:center;margin-bottom:16px;">
                <a href="${SITE_URL}/destinations" style="display:inline-block;background-color:#facc15;color:#0f172a;font-size:16px;font-weight:700;padding:14px 32px;border-radius:12px;text-decoration:none;letter-spacing:0.3px;">
                    🧭 Explore More Treks
                </a>
            </div>
            <div style="text-align:center;">
                <a href="${SITE_URL}/dashboard" style="display:inline-block;color:#facc15;font-size:14px;font-weight:600;text-decoration:none;padding:8px 16px;">
                    Submit Feedback →
                </a>
            </div>
        </div>
    `;

    return baseLayout(content);
}

/** Escape HTML special characters for safe embedding */
function escapeHtml(text: string): string {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}
