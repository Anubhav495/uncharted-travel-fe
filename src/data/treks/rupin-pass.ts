import { Trek } from '@/types/trek';

export const rupinPassTrek: Trek = {
    id: '6',
    slug: 'rupin-pass-trek',
    title: 'Rupin Pass Trek',
    location: 'Shimla, Himachal Pradesh',
    duration: '7 Days',
    difficulty: 'Hard',
    price: '₹15,500',
    image: '/assets/rupin-pass/2.jpg',
    imagePosition: 'center',
    guideName: 'Kapil Rawat',
    guideAvatar: '/assets/kapil-rawat.jpeg',
    badges: ['Pass Crossing', 'Waterfalls', 'Snow'],
    category: 'Trekking',
    overview: 'The Rupin Pass Trek is one of the most diverse and visually stunning treks in India, connecting the lush green valleys of Himachal Pradesh to the rugged terrain of Uttarakhand. At 15,250 ft, the pass rewards trekkers with dramatic snow walls, hanging meadows, glacial rivers, and the spectacular Rupin waterfall. This trek is a masterclass in changing landscapes — from dense forests and terraced villages to alpine meadows and snow-clad passes.',
    highlights: [
        'Cross the dramatic Rupin Pass at 15,250 ft with towering snow walls',
        'Witness the magnificent Rupin waterfall cascading from great heights',
        'Trek through diverse landscapes — forests, meadows, snow fields, and alpine terrain',
        'Camp at the stunning Upper Waterfall campsite with panoramic views',
        'Experience the cultural richness of remote Himalayan villages like Jiskun and Jakha',
        'Traverse hanging gardens and wildflower meadows unique to this region'
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
            title: 'Shimla to Jiskun via Rohru',
            description: 'Drive from Shimla through the scenic Pabbar Valley to the remote village of Jiskun, the starting point of the trek. Explore the traditional wooden architecture and settle in for the night.',
            distance: '—',
            elevation: '7,700 ft'
        },
        {
            day: 2,
            title: 'Jiskun to Saruwas Thatch',
            description: 'Begin the trek through dense forests of oak and maple, crossing streams and ascending gradually to the beautiful meadow of Saruwas Thatch.',
            distance: '8 km',
            elevation: '9,800 ft',
            meals: 'Breakfast, Lunch, Dinner'
        },
        {
            day: 3,
            title: 'Saruwas Thatch to Upper Waterfall',
            description: 'Trek through enchanting hanging meadows and get your first views of the magnificent Rupin waterfall. The campsite sits right above the waterfall with breathtaking views.',
            distance: '6 km',
            elevation: '11,800 ft',
            meals: 'Breakfast, Lunch, Snacks, Dinner'
        },
        {
            day: 4,
            title: 'Upper Waterfall to Rupin Pass Base (Rati Pheri)',
            description: 'Ascend through rocky terrain and snow patches to reach Rati Pheri, the base camp for the pass crossing. Acclimatize and prepare for the summit push.',
            distance: '5 km',
            elevation: '13,600 ft',
            meals: 'Breakfast, Lunch, Snacks, Dinner'
        },
        {
            day: 5,
            title: 'Rati Pheri to Rupin Pass to Ronti Gad',
            description: 'The big day! Cross the Rupin Pass at 15,250 ft through dramatic snow walls. Descend steeply on the Uttarakhand side through snow fields to Ronti Gad campsite.',
            distance: '10 km',
            elevation: '15,250 ft (pass) → 12,500 ft',
            meals: 'Breakfast, Lunch, Snacks, Dinner'
        },
        {
            day: 6,
            title: 'Ronti Gad to Sangla Valley',
            description: 'Descend through alpine meadows and birch forests into the beautiful Sangla Valley. The landscape transitions dramatically as you enter Kinnaur.',
            distance: '12 km',
            elevation: '8,600 ft',
            meals: 'Breakfast, Lunch, Snacks, Dinner'
        },
        {
            day: 7,
            title: 'Sangla to Shimla',
            description: 'Drive back to Shimla through the stunning Kinnaur Valley, passing apple orchards and dramatic river gorges. Trek ends with unforgettable memories.',
            distance: '—',
            elevation: '—'
        }
    ],
    gallery: [
        '/assets/rupin-pass/2.jpg',
        '/assets/rupin-pass/3.jpg',
        '/assets/rupin-pass/4.jpg',
        '/assets/rupin-pass/5.jpg',
        '/assets/rupin-pass/6.jpg',
        '/assets/rupin-pass/7.jpg',
        '/assets/rupin-pass/8.jpg',
        '/assets/rupin-pass/9.jpg'
    ]
};
