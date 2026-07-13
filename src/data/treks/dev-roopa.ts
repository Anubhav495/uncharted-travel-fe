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
    guideName: 'Pritam Negi',
    guideAvatar: '/assets/pritam-photo-edited.png',
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
            id: 'guide-pritam-negi',
            name: 'Pritam Negi',
            avatar: '/assets/pritam-photo-edited.png',
            experience: '8 Years',
            languages: ['English', 'Hindi', 'Pahadi'],
            rating: 4.9,
            reviews: 145,
            description: 'A highly experienced guide from the Parvati Valley region, Pritam knows the offbeat trails like the back of his hand.'
        },
        {
            id: 'guide-bhojraj',
            name: 'Bhojraj',
            avatar: '/assets/bhojraj.jpg',
            experience: '5 Years',
            languages: ['Hindi', 'Pahadi', 'English'],
            rating: 4.7,
            reviews: 24,
            description: 'Bhojraj is an experienced local guide with a passion for the pristine landscapes of Himachal. He ensures a safe and memorable journey through the challenging trails of Dev Roopa.'
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
