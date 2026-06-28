import { Trek } from '@/types/trek';

export const devRoopaTrek: Trek = {
    id: '7',
    slug: 'dev-roopa-trek',
    title: 'Dev Roopa Trek',
    location: 'Parvati Valley, Himachal Pradesh',
    duration: '5 to 6 Days',
    difficulty: 'Moderate',
    price: '₹8,000',
    image: '/assets/dev-roopa/WhatsApp Image 2026-06-28 at 10.05.47 (1).jpeg',
    imagePosition: 'center',
    guideName: 'Aatish Sharma',
    guideAvatar: '/assets/aatish-photo.jpeg',
    badges: ['Offbeat', 'Meadows', 'Culture'],
    category: 'Trekking',
    overview: 'Often referred to as the "Descent of God," Dev Roopa is a scenic and offbeat Himalayan trek located in the Malana region of Parvati Valley. Known for its vast, pristine grasslands, high-altitude glacial streams, and proximity to remote areas, this trek offers a unique experience away from the crowds. The trail takes you through dense forests, grazing fields, and eventually to the spectacular Dev Roopa meadows at around 14,000 ft.',
    highlights: [
        'Trek through the legendary Parvati and Malana Valleys',
        'Experience the vast and pristine Dev Roopa meadows',
        'Follow high-altitude glacial streams meandering through grasslands',
        'Camp in remote, offbeat locations away from typical tourist crowds',
        'Immerse in the unique culture of the surrounding villages'
    ],
    guides: [
        {
            id: 'guide-aatish-sharma',
            name: 'Aatish Sharma',
            avatar: '/assets/aatish-photo.jpeg',
            experience: '6 Years',
            languages: ['English', 'Hindi', 'Pahari'],
            rating: 4.8,
            reviews: 32,
            description: 'Aatish is a local from the Kullu valley with extensive knowledge of the offbeat trails in Parvati and Malana regions. His deep connection with the local culture and terrain makes him an excellent guide for remote treks.'
        }
    ],
    companies: [],
    itinerary: [
        {
            day: 1,
            title: 'Kasol to Malana Dam and trek to Behali',
            description: 'Drive from Kasol to Malana Dam, then start the trek towards the first campsite at Behali through beautiful forest trails.',
            distance: '5 km',
            elevation: '8,500 ft'
        },
        {
            day: 2,
            title: 'Behali to Mota Grahan',
            description: 'Trek through dense pine and oak forests, crossing streams and grazing fields to reach the Mota Grahan campsite.',
            distance: '7 km',
            elevation: '10,200 ft'
        },
        {
            day: 3,
            title: 'Mota Grahan to Bogdi',
            description: 'Ascend further into the alpine region, leaving the tree line behind to reach the high-altitude camp at Bogdi.',
            distance: '6 km',
            elevation: '12,500 ft'
        },
        {
            day: 4,
            title: 'Bogdi to Dev Roopa and back',
            description: 'The summit day. Trek to the spectacular Dev Roopa meadows, explore the meandering streams, and return to Bogdi.',
            distance: '8 km',
            elevation: '14,100 ft'
        },
        {
            day: 5,
            title: 'Bogdi to Mota Grahan / Behali',
            description: 'Begin the descent back through the familiar trails, enjoying the landscape from a different perspective.',
            distance: '10 km',
            elevation: '10,200 ft'
        },
        {
            day: 6,
            title: 'Trek to Malana Dam and drive to Kasol',
            description: 'Complete the final leg of the descent to Malana Dam, followed by a drive back to Kasol.',
            distance: '5 km',
            elevation: '8,500 ft'
        }
    ],
    gallery: [
        '/assets/dev-roopa/IMG_20251024_173524.jpg',
        '/assets/dev-roopa/WhatsApp Image 2026-06-28 at 10.05.46.jpeg',
        '/assets/dev-roopa/WhatsApp Image 2026-06-28 at 10.05.46 (1).jpeg',
        '/assets/dev-roopa/WhatsApp Image 2026-06-28 at 10.05.47.jpeg',
        '/assets/dev-roopa/WhatsApp Image 2026-06-28 at 10.05.47 (1).jpeg',
        '/assets/dev-roopa/WhatsApp Image 2026-06-28 at 10.05.47 (2).jpeg',
        '/assets/dev-roopa/WhatsApp Image 2026-06-28 at 10.05.48.jpeg',
        '/assets/dev-roopa/WhatsApp Image 2026-06-28 at 10.05.48 (1).jpeg',
        '/assets/dev-roopa/WhatsApp Image 2026-06-28 at 10.05.48 (2).jpeg',
        '/assets/dev-roopa/WhatsApp Image 2026-06-28 at 10.05.48 (3).jpeg',
        '/assets/dev-roopa/WhatsApp Image 2026-06-28 at 10.05.49.jpeg'
    ]
};
