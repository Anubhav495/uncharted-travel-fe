import { Trek } from '@/types/trek';

export const kareriLakeTrek: Trek = {
    id: '3',
    slug: 'kareri-lake-trek',
    title: 'Kareri Lake Trek',
    location: 'Dharamshala, Himachal',
    duration: '3 Days',
    difficulty: 'Moderate',
    price: '₹1,500',
    image: '/assets/kareri-lake.jpg',
    imagePosition: 'center',
    guideName: 'Aatish',
    guideAvatar: '',
    badges: ['Alpine Lake', 'Scenic'],
    category: 'Trekking',
    overview: 'The Kareri Lake Trek is a stunning alpine adventure nestled in the Dhauladhar range near Dharamshala, Himachal Pradesh. Sitting at an altitude of 9,626 ft, Kareri Lake is a pristine glacial lake fed by snowmelt from the surrounding peaks. The trek takes you through dense forests of oak, deodar, and rhododendron, across gurgling streams, and past the charming Gaddi shepherds\' settlements. The lake, surrounded by snow-capped mountains and lush meadows, offers a mesmerizing reflection of the Dhauladhar peaks — a sight that stays with you long after the trek ends.',
    highlights: [
        'Witness the crystal-clear glacial Kareri Lake at 9,626 ft',
        'Trek through dense oak, deodar & rhododendron forests',
        'Stunning views of the Dhauladhar mountain range',
        'Camp beside the pristine alpine lake under starlit skies',
        'Interact with Gaddi shepherds and their unique culture',
        'Explore the ancient Kareri Village with terraced fields'
    ],
    guides: [
        {
            id: 'g3',
            name: 'Aatish',
            avatar: '',
            experience: '7 Years',
            languages: ['English', 'Hindi', 'Pahadi'],
            rating: 4.7,
            description: 'Aatish grew up in the foothills of the Dhauladhar range and has been leading treks to Kareri Lake and beyond since his teenage years. His deep understanding of alpine terrain and local Gaddi culture makes every expedition both safe and enriching.'
        }
    ],
    itinerary: [
        {
            day: 1,
            title: 'Dharamshala to Kareri Village & Trek to Lioti',
            description: 'Drive from Dharamshala to the quaint Kareri Village (6,200 ft), surrounded by terraced fields and traditional Himachali homes. Begin the trek with a gradual ascent through dense oak and deodar forests. Cross a few small streams as the trail climbs steadily. Reach Lioti, a beautiful campsite nestled in a meadow clearing with views of the Dhauladhar ridge. Settle into camp and enjoy a warm dinner under the stars.',
            distance: '8 km',
            elevation: '8,200 ft'
        },
        {
            day: 2,
            title: 'Lioti to Kareri Lake',
            description: 'After breakfast, resume the trek through rhododendron and birch forests. The trail steepens as you approach the treeline. Cross the Kareri stream on rocky terrain before the final push to the lake. The moment Kareri Lake comes into view — its turquoise waters reflecting the towering Dhauladhar peaks — is truly breathtaking. Spend the afternoon exploring the lake shore, taking photos, and soaking in the serene atmosphere. Camp beside the lake for a magical night.',
            distance: '6 km',
            elevation: '9,626 ft'
        },
        {
            day: 3,
            title: 'Kareri Lake to Kareri Village & Drive to Dharamshala',
            description: 'Wake up to a spectacular sunrise over the lake. After breakfast, begin the descent back to Kareri Village. The downhill trek is faster and offers fresh perspectives of the valley and surrounding peaks. Arrive at Kareri Village by early afternoon, where a vehicle takes you back to Dharamshala. The trek concludes with unforgettable memories of the Dhauladhar wilderness.',
            distance: '14 km',
            elevation: '6,200 ft'
        }
    ],
    gallery: [
        '/assets/kareri-lake.jpg'
    ]
};
