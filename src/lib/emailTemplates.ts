import type { Guide, Trek } from '@/types/trek';

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

export interface GuideAssignmentEmailData {
    userName: string;
    trek: Pick<Trek, 'title' | 'slug' | 'location' | 'duration' | 'itinerary' | 'arrivalInstructions'>;
    guide: Pick<Guide, 'name' | 'avatar' | 'experience' | 'languages' | 'description'>;
    departureDate?: string;
    packingItems?: string[];
    guideFee?: number;
    additionalCharges?: string;
}

export const DEFAULT_TREK_PACKING_ITEMS = [
    'Moov spray (for aches and sprains)',
    'Trekking shoes',
    'Trekking pole',
    'Winter jacket',
    'Body warmers (upper and lower)',
    'Woollen or cold-weather cap',
    'Sunscreen (optional)',
    'Paracetamol',
    'Protein bars',
    'Glucose or electrolyte sachets',
    'Raincoat',
];

/** Introduce an assigned guide and share the route and a practical packing checklist. */
export function guideAssignmentEmailTemplate({
    userName,
    trek,
    guide,
    departureDate,
    packingItems = DEFAULT_TREK_PACKING_ITEMS,
    guideFee,
    additionalCharges,
}: GuideAssignmentEmailData): string {
    const guidePhoto = guide.avatar.startsWith('/assets/') && !guide.avatar.includes('..')
        ? `${SITE_URL}${encodeURI(guide.avatar)}`
        : null;
    const routeRows = (trek.itinerary || []).map((day) => `
        <tr>
            <td valign="top" width="62" style="padding:0 12px 20px 0;color:#b45309;font-size:12px;font-weight:700;white-space:nowrap;">DAY ${escapeHtml(String(day.day))}</td>
            <td valign="top" style="padding:0 0 20px 0;border-left:2px solid #fcd34d;">
                <div style="padding-left:16px;color:#0f172a;font-size:15px;font-weight:700;line-height:1.4;">${escapeHtml(day.title)}</div>
                ${day.distance ? `<div style="padding:5px 0 0 16px;color:#64748b;font-size:13px;">${escapeHtml(day.distance)} on trail</div>` : ''}
            </td>
        </tr>`).join('');
    const packingRows = packingItems.map((item) => `
        <tr><td valign="top" width="24" style="padding:0 4px 11px 0;color:#b45309;font-size:16px;">✓</td><td valign="top" style="padding:0 0 11px 0;color:#334155;font-size:14px;line-height:1.5;">${escapeHtml(item)}</td></tr>`).join('');
    const arrivalRows = trek.arrivalInstructions?.steps.map((step, index) => `
        <tr><td valign="top" width="32" style="padding:0 8px 15px 0;color:#b45309;font-size:14px;font-weight:700;">${index + 1}.</td><td valign="top" style="padding:0 0 15px 0;color:#334155;font-size:14px;line-height:1.6;">${escapeHtml(step)}</td></tr>`).join('');

    const content = `
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">
            <tr><td height="5" style="height:5px;background-color:#facc15;font-size:0;line-height:0;">&nbsp;</td></tr>
            <tr><td style="padding:34px 36px 32px;background-color:#1e293b;"><p style="margin:0 0 14px;color:#facc15;font-size:12px;font-weight:700;letter-spacing:2px;text-transform:uppercase;">YOUR TREK, YOUR GUIDE</p><h1 style="margin:0 0 12px;color:#ffffff;font-size:29px;line-height:1.2;font-weight:800;">${escapeHtml(userName)}, meet your guide</h1><p style="margin:0;color:#cbd5e1;font-size:15px;line-height:1.7;">Your guide for <strong style="color:#ffffff;">${escapeHtml(trek.title)}</strong> is ready to lead the way. Here are the details to help you get set for the journey.</p></td></tr>
            <tr><td style="padding:30px 36px 34px;background-color:#ffffff;"><p style="margin:0 0 14px;color:#b45309;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">YOUR ASSIGNED GUIDE</p><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;background-color:#f8fafc;border:1px solid #e2e8f0;"><tr>${guidePhoto ? `<td valign="top" width="94" style="padding:22px 0 22px 22px;"><img src="${escapeHtml(guidePhoto)}" alt="Photo of ${escapeHtml(guide.name)}" width="72" height="72" style="display:block;width:72px;height:72px;border-radius:50%;object-fit:cover;" /></td>` : ''}<td valign="top" style="padding:22px;"><h2 style="margin:0 0 5px;color:#0f172a;font-size:20px;line-height:1.3;">${escapeHtml(guide.name)}</h2><p style="margin:0;color:#475569;font-size:13px;line-height:1.5;">${escapeHtml(guide.experience)} of experience${guide.languages.length ? ` &nbsp;·&nbsp; Speaks ${escapeHtml(guide.languages.join(', '))}` : ''}</p></td></tr></table><p style="margin:17px 0 0;color:#475569;font-size:14px;line-height:1.7;">${escapeHtml(guide.description)}</p></td></tr>
            <tr><td style="padding:30px 36px;background-color:#f8fafc;border-top:1px solid #e2e8f0;"><p style="margin:0 0 8px;color:#b45309;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">THE ROUTE</p><h2 style="margin:0 0 8px;color:#0f172a;font-size:22px;line-height:1.3;">${escapeHtml(trek.title)}</h2><p style="margin:0 0 24px;color:#475569;font-size:14px;line-height:1.6;">${escapeHtml(trek.location)} &nbsp;·&nbsp; ${escapeHtml(trek.duration)}${departureDate ? ` &nbsp;·&nbsp; ${escapeHtml(departureDate)}` : ''}</p>${routeRows ? `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${routeRows}</table>` : '<p style="margin:0;color:#475569;font-size:14px;">Your guide will share the detailed route before departure.</p>'}</td></tr>
            ${trek.arrivalInstructions ? `<tr><td style="padding:30px 36px;background-color:#ffffff;border-top:1px solid #e2e8f0;"><p style="margin:0 0 8px;color:#b45309;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">GETTING THERE</p><h2 style="margin:0 0 18px;color:#0f172a;font-size:22px;line-height:1.3;">${escapeHtml(trek.arrivalInstructions.title)}</h2><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${arrivalRows}</table></td></tr>` : ''}
            ${guideFee !== undefined || additionalCharges ? `<tr><td style="padding:30px 36px;background-color:#f8fafc;border-top:1px solid #e2e8f0;"><p style="margin:0 0 8px;color:#b45309;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">PRICING</p><h2 style="margin:0 0 16px;color:#0f172a;font-size:22px;line-height:1.3;">Guide fee and other costs</h2>${guideFee !== undefined ? `<p style="margin:0 0 10px;color:#0f172a;font-size:16px;line-height:1.5;">Guide fee: <strong style="font-size:22px;">₹${guideFee.toLocaleString('en-IN')}</strong></p>` : ''}${additionalCharges ? `<p style="margin:0;color:#475569;font-size:14px;line-height:1.6;">${escapeHtml(additionalCharges)}</p>` : ''}</td></tr>` : ''}
            <tr><td style="padding:30px 36px 36px;background-color:#ffffff;border-top:1px solid #e2e8f0;"><p style="margin:0 0 8px;color:#b45309;font-size:12px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;">GET READY</p><h2 style="margin:0 0 18px;color:#0f172a;font-size:22px;line-height:1.3;">What to pack</h2><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;">${packingRows}</table><table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:18px;"><tr><td bgcolor="#facc15" style="background-color:#facc15;border-radius:8px;"><a href="${SITE_URL}/destinations/${encodeURIComponent(trek.slug)}" style="display:inline-block;padding:14px 22px;color:#0f172a;font-size:14px;font-weight:700;text-decoration:none;">View trek details</a></td></tr></table><p style="margin:24px 0 0;color:#475569;font-size:13px;line-height:1.6;">Have a question before you go? Reply to this email and our team will help.</p></td></tr>
        </table>`;

    return baseLayout(content);
}
