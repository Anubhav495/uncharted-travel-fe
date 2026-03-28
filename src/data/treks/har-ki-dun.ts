import { Trek } from '@/types/trek';

export const harKiDunTrek: Trek = {
    id: '5',
    slug: 'har-ki-dun-trek',
    title: 'Har Ki Dun Trek',
    location: 'Sankri, Uttarakhand',
    duration: '5 Days',
    difficulty: 'Moderate',
    price: '₹4,500',
    image: '/assets/har-ki-dun/6.jpg',
    imagePosition: 'center',
    guideName: 'Kapil Rawat',
    guideAvatar: '/assets/kapil-rawat.jpeg',
    badges: ['Culture', 'Valley of Gods', 'Wildlife'],
    category: 'Trekking',
    overview: 'Known as the "Valley of Gods", Har Ki Dun is a historically significant and visually stunning trek in Govind Pashu Vihar National Park. Tracing the path supposedly taken by the Pandavas to heaven, this cradle-shaped valley is brimming with untouched ancient villages, rich flora and fauna, and spectacular alpine meadows draped below towering glaciated peaks.',
    highlights: [
        'Trek through the legendary Valley of the Gods',
        'Witness ancient wooden architecture in Osla village',
        'Camp beside the gushing Supin River',
        'Spot Himalayan flora and diverse wildlife',
        'Enjoy unparalleled views of Swargarohini peak',
        'Immerse in the rich, preserved culture of the Garhwal Himalayas'
    ],
    guides: [
        {
            id: 'g3',
            name: 'Kapil Rawat',
            avatar: '/assets/kapil-rawat.jpeg',
            experience: '8 Years',
            languages: ['English', 'Hindi', 'Garhwali'],
            rating: 4.9,
            reviews: 47,
            description: 'Kapil is a native of Sankri and has been leading expeditions in the Garhwal Himalayas for nearly a decade. His expertise in snow navigation and high-altitude safety makes him an incredible expedition leader.'
        }
    ],
    companies: [],
    itinerary: [
        {
            day: 1,
            title: 'Sankri to Pauni Garaat via Taluka',
            description: 'Drive briefly to Taluka, then start the trek through dense forests along the Supin river to the campsite.',
            distance: '10 km',
            elevation: '8,200 ft'
        },
        {
            day: 2,
            title: 'Pauni Garaat to Kalkatiyadhaar',
            description: 'Trek past the ancient village of Osla architecture and continue ascending to Kalkatiyadhaar.',
            distance: '7 km',
            elevation: '8,950 ft'
        },
        {
            day: 3,
            title: 'Kalkatiyadhaar to Har Ki Dun and back',
            description: 'Reach the breathtaking Har Ki Dun valley, spend time exploring, and return to Kalkatiyadhaar.',
            distance: '10 km',
            elevation: '11,700 ft'
        },
        {
            day: 4,
            title: 'Kalkatiyadhaar to Pauni Garaat',
            description: 'Retrace your steps back downhill observing the valley from a new perspective.',
            distance: '7 km',
            elevation: '8,200 ft'
        },
        {
            day: 5,
            title: 'Pauni Garaat to Sankri',
            description: 'Relish the final day of trekking back to Taluka, catching transport back to Sankri.',
            distance: '10 km',
            elevation: '6,400 ft'
        }
    ],
    gallery: [
        '/assets/har-ki-dun/1.jpg',
        '/assets/har-ki-dun/2.jpg',
        '/assets/har-ki-dun/3.jpg',
        '/assets/har-ki-dun/4.jpg',
        '/assets/har-ki-dun/5.jpg',
        '/assets/har-ki-dun/6.jpg',
        '/assets/har-ki-dun/7.jpg',
        '/assets/har-ki-dun/8.jpg',
        '/assets/har-ki-dun/9.jpg',
        '/assets/har-ki-dun/10.jpg'
    ]
};
