import { Trek } from '@/types/trek';

/**
 * Route based on the Kasla–Rala–Devbhasa journey shared by the team.
 * Lake context: https://aquaterra.in/wp-content/uploads/2023/02/Baraadsar-Lake-Trek.pdf
 * Ridge views: https://www.bikatadventures.com/home/blog/Baraadsar-Lake-Photo-Story
 */
export const baraadsarLakeTrek: Trek = {
    id: 'baraadsar-lake',
    slug: 'baraadsar-lake-trek',
    title: 'Baraadsar Lake Trek',
    location: 'Uttarkashi, Uttarakhand · Himachal border',
    duration: '7 Days (suggested)',
    difficulty: 'Hard',
    price: '₹20,999 / person',
    image: '/assets/images/treks/baraadsar-lake/lake-cover.jpg',
    guideName: 'Kailash Rawat',
    guideAvatar: '/assets/kailash-rawat.jpeg',
    badges: ['Sacred Lake', 'Ridge Walk', 'Offbeat'],
    category: 'Trekking',
    overview: 'Baraadsar Lake is a sacred high-altitude lake near the Uttarakhand–Himachal border. It sits at around 4,300 metres between the Rupin and Supin valleys, surrounded by high ridges. Local communities consider it sacred and believe that prayers offered here never go unanswered. Our route starts from Kasla, passes through Rala and the open ridges of Daldhar, and continues to Devbhasa before the climb towards the lake. Expect steep sections, remote camps and stretches where water is scarce. The seven-day itinerary is a suggested plan; your guide will confirm the camps and return stages based on snow, weather and the pace of the group.',
    highlights: [
        'Reach the sacred Baraadsar Lake, known locally as a wish-fulfilling lake',
        'Walk the Daldhar ridges with views of Swargarohini and Kalanag (Black Peak)',
        'Follow the quieter route through Kasla, Rala and Devbhasa',
        'Experience the changing landscape from village trails to high mountain ridges',
        'Plan water supplies and porter support with your guide before leaving the villages',
    ],
    guides: [
        {
            id: 'guide-kailash-rawat',
            name: 'Kailash Rawat',
            avatar: '/assets/kailash-rawat.jpeg',
            experience: '20 Years',
            languages: ['Hindi', 'Pahadi'],
            rating: 4.8,
            reviews: 187,
            description: 'Based in Sankri, Kailash is a veteran trek leader with 20 years of experience and has been leading treks with Uncharted Travel for many years. His experience helps him navigate difficult trails, handle challenging situations and guide his team through changing mountain conditions.',
        },
    ],
    companies: [],
    arrivalInstructions: {
        title: 'How to reach the trailhead',
        steps: [
            'Travel to Dehradun and arrange onward transport to Sankri before departure.',
            'Meet your guide in Sankri and confirm the route, equipment, porter support and water arrangements.',
            'Arrange a suitable local vehicle from Sankri to Kasla, where the walking route begins.',
        ],
    },
    itinerary: [
        {
            day: 1,
            title: 'Arrive in Sankri',
            description: 'Reach Sankri, meet your guide and settle in. Use the evening to check your equipment and discuss the suggested route, camps and water arrangements.',
        },
        {
            day: 2,
            title: 'Sankri to Kasla, trek to Rala',
            description: 'Travel to Kasla by a suitable local vehicle and begin walking towards Rala. Follow the village trails and spend the night in Rala before continuing higher.',
            distance: '5 km trek',
            elevation: '7,546 ft',
        },
        {
            day: 3,
            title: 'Rala to Devbhasa via Daldhar',
            description: 'Climb towards Daldhar, where the views open up across the surrounding Himalayan ranges. Continue to Devbhasa for the night. Water sources can be far from camp, so carry the supply agreed with your guide.',
            distance: '8 km',
            elevation: '11,975 ft',
        },
        {
            day: 4,
            title: 'Devbhasa to high camp via the Baraadsar ridge',
            description: 'Take on the steep ridge crossing towards the lake basin. Snow can make this section demanding, and the guide will decide whether conditions allow the group to continue. The high camp location depends on the conditions.',
        },
        {
            day: 5,
            title: 'Baraadsar Lake and begin the descent',
            description: 'Climb to the lake, spend time taking in the surroundings and respect its significance to the local communities. Begin the return towards Devbhasa, with the overnight stop confirmed by your guide.',
            distance: '14 km round trip',
            elevation: '14,108 ft',
        },
        {
            day: 6,
            title: 'Descend towards Rala',
            description: 'Continue down from the higher camps towards Rala. The return stages may change with snow conditions and the pace of the group.',
            distance: '7–8 km',
            elevation: '8,840 ft',
        },
        {
            day: 7,
            title: 'Return to Kasla and Sankri',
            description: 'Complete the remaining descent to Kasla and return to Sankri by local vehicle. Allow time for changes to the mountain route before planning onward travel.',
            distance: '3 km trek',
            elevation: '6,500 ft',
        },
    ],
    gallery: [
        '/assets/images/treks/baraadsar-lake/lake-cover.jpg',
        '/assets/images/treks/baraadsar-lake/meadow-and-mountain-range.jpg',
        '/assets/images/treks/baraadsar-lake/ridge-and-stone-cairn.jpg',
        '/assets/images/treks/baraadsar-lake/village-temple.jpg',
        '/assets/images/treks/baraadsar-lake/sheep-on-the-forest-trail.jpg',
        '/assets/images/treks/baraadsar-lake/standing-stone-and-valley.jpg',
        '/assets/images/treks/baraadsar-lake/misty-green-meadow.jpg',
        '/assets/images/treks/baraadsar-lake/snow-covered-ridges.jpg',
        '/assets/images/treks/baraadsar-lake/rocky-ridge-and-snow.jpg',
        '/assets/images/treks/baraadsar-lake/clouds-over-the-valley.jpg',
        '/assets/images/treks/baraadsar-lake/snowy-basin-and-frozen-stream.jpg',
    ],
};
