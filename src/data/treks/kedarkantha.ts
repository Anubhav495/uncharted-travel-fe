import { Trek } from '@/types/trek';

export const kedarkanthaTrek: Trek = {
    id: '4',
    slug: 'kedarkantha-trek',
    title: 'Kedarkantha Trek',
    location: 'Sankri, Uttarakhand',
    duration: '4 Days',
    difficulty: 'Moderate',
    price: '₹3,500',
    image: '/assets/kedarkantha/7.jpg',
    imagePosition: 'center',
    guideName: 'Kapil Rawat',
    guideAvatar: '/assets/kapil-rawat.jpeg',
    badges: ['Snow Trek', 'Winter Classic', 'Summit Climb'],
    category: 'Trekking',
    overview: 'Kedarkantha is one of the finest winter treks in the Himalayas. Starting from the scenic village of Sankri, the trail takes you through dense pine forests, frozen lakes, and magical snow-draped meadows. The highlight is the thrilling summit climb which offers a 360-degree view of legendary peaks like Swargarohini, Black Peak, and Bandarpoonch.',
    highlights: [
        'Experience the thrill of a snowy summit climb at 12,500 ft',
        'Immerse yourself in thick pine and oak forests',
        'Camp at the stunning Juda-ka-Talab frozen lake',
        'Witness majestic views of Swargarohini and Black Peak',
        'Enjoy clear winter skies perfect for stargazing',
        'Explore the vibrant culture of Sankri village'
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
            title: 'Sankri to Juda-ka-Talab',
            description: 'Trek through dense pine forests to reach the beautiful frozen lake campsite of Juda-ka-Talab.',
            distance: '4 km',
            elevation: '9,100 ft'
        },
        {
            day: 2,
            title: 'Juda-ka-Talab to Kedarkantha Base Camp',
            description: 'A shorter day trekking above the treeline with sweeping valley views to reach the base camp.',
            distance: '4 km',
            elevation: '11,250 ft'
        },
        {
            day: 3,
            title: 'Summit Day and descent to Hargaon',
            description: 'Start early for the thrilling climb to the Kedarkantha summit (12,500 ft) for sunrise, then descend to Hargaon campsite.',
            distance: '6 km',
            elevation: '12,500 ft'
        },
        {
            day: 4,
            title: 'Hargaon to Sankri',
            description: 'Descend through apple orchards back to Sankri for celebration and rest.',
            distance: '6 km',
            elevation: '6,400 ft'
        }
    ],
    gallery: [
        '/assets/kedarkantha/1.jpg',
        '/assets/kedarkantha/2.jpg',
        '/assets/kedarkantha/3.jpg',
        '/assets/kedarkantha/4.jpg',
        '/assets/kedarkantha/5.jpg',
        '/assets/kedarkantha/6.jpg',
        '/assets/kedarkantha/7.jpg',
        '/assets/kedarkantha/8.jpg'
    ]
};
