import { Trek } from '@/types/trek';

export const buniBuniPassTrek: Trek = {
    id: '8',
    slug: 'buni-buni-pass',
    title: 'Buni Buni Pass Trek',
    location: 'Parvati Valley, Himachal Pradesh',
    duration: '2-3 Days',
    difficulty: 'Easy',
    price: '₹2,499',
    image: '/assets/buni-buni-pass/photo-2.jpg',
    imagePosition: 'center',
    guideName: 'Pritam Negi',
    guideAvatar: '/assets/pritam-photo-edited.png',
    badges: ['Meadows', 'Offbeat', 'Forests'],
    category: 'Trekking',
    overview: 'The Buni Buni Pass (also known as Bunbuni or Bhunbhuni Pass) is a spectacular and offbeat alternative to the crowded Kheerganga trek in the Parvati Valley. It offers stunning alpine meadows, dense oak and rhododendron forests, and panoramic views of snow-capped Himalayan peaks. With altitudes reaching around 11,000 ft, this trek presents a moderate challenge with steep ascents, rewarding trekkers with pristine landscapes and tranquility away from the typical tourist trails.',
    highlights: [
        'Hike through dense pine and deodar forests',
        'Experience the vast, untouched alpine meadows of Bunbuni',
        'Enjoy panoramic views of snow-capped peaks in the Parvati Valley',
        'Camp under the stars in a pristine, offbeat location',
        'Optionally combine the trek with a descent to the famous Kheerganga hot springs'
    ],
    guides: [
        {
            id: 'guide-pritam-negi',
            name: 'Pritam Negi',
            avatar: '/assets/pritam-photo-edited.png',
            experience: '8 Years',
            languages: ['English', 'Hindi', 'Pahadi'],
            rating: 4.9,
            reviews: 145,
            description: 'A highly experienced guide from the Parvati Valley region, Pritam knows the offbeat trails like the back of his hand.'
        }
    ],
    companies: [],
    itinerary: [
        {
            day: 1,
            title: 'Kalga to Buni Buni Pass',
            description: 'Begin the steep ascent from Kalga through dense forests. After several hours of climbing, emerge into the beautiful alpine meadows of Bunbuni. Set up camp and enjoy the panoramic views.',
            distance: '8 km',
            elevation: '10,980 ft'
        },
        {
            day: 2,
            title: 'Buni Buni Pass to Kheerganga',
            description: 'Descend from the pass towards Kheerganga. The trail offers magnificent views. Upon reaching Kheerganga, relax in the natural hot springs.',
            distance: '5 km',
            elevation: '9,700 ft'
        },
        {
            day: 3,
            title: 'Kheerganga to Barshaini',
            description: 'Trek downhill back to Barshaini, tracing the Parvati river, and depart for your onward journey.',
            distance: '12 km',
            elevation: '7,400 ft'
        }
    ],
    gallery: [
        '/assets/buni-buni-pass/photo-1.jpg',
        '/assets/buni-buni-pass/photo-2.jpg',
        '/assets/buni-buni-pass/photo-3.jpg',
        '/assets/buni-buni-pass/photo-4.jpg',
        '/assets/buni-buni-pass/photo-5.jpg',
        '/assets/buni-buni-pass/photo-6.jpg',
        '/assets/buni-buni-pass/photo-7.jpg',
        '/assets/buni-buni-pass/photo-8.jpg',
        '/assets/buni-buni-pass/photo-9.jpg'
    ]
};
