import { devRoopaTrek } from '@/data/treks/dev-roopa';
import { completedEmailTemplate, guideAssignmentEmailTemplate } from './emailTemplates';

describe('email templates', () => {
    it('keeps the completed-trek leaderboard call to action on the community page', () => {
        const html = completedEmailTemplate('Mehul', 'Dev Roopa Trek', 250);

        expect(html).toContain('href="https://unchartedtravel.in/community"');
    });

    it('includes the guide, route, and packing checklist in the guide assignment email', () => {
        const html = guideAssignmentEmailTemplate({
            userName: 'Mehul',
            trek: devRoopaTrek,
            guide: devRoopaTrek.guides![0],
            departureDate: '12 December 2026',
        });

        expect(html).toContain('Mehul, meet your guide');
        expect(html).toContain('Pritam Negi');
        expect(html).toContain('Kasol to Malana Dam and trek to Waichin');
        expect(html).toContain('12 December 2026');
        expect(html).toContain('Moov spray (for aches and sprains)');
        expect(html).toContain('https://unchartedtravel.in/destinations/dev-roopa-trek');
    });

    it('escapes customer supplied guide-email content', () => {
        const html = guideAssignmentEmailTemplate({
            userName: '<script>alert(1)</script>',
            trek: {
                ...devRoopaTrek,
                itinerary: [{ day: 1, title: '<b>unsafe</b>', description: '' }],
            },
            guide: { ...devRoopaTrek.guides![0], avatar: 'javascript:alert(1)' },
            packingItems: ['<img src=x onerror=alert(1)>'],
        });

        expect(html).toContain('&lt;script&gt;alert(1)&lt;/script&gt;');
        expect(html).toContain('&lt;b&gt;unsafe&lt;/b&gt;');
        expect(html).toContain('&lt;img src=x onerror=alert(1)&gt;');
        expect(html).not.toContain('<script>');
        expect(html).not.toContain('src="javascript:');
    });
});
