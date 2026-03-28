import { Trek } from '@/types/trek';

export const kheergangaTrek: Trek = {
    id: '2',
    slug: 'kheerganga-trek',
    title: 'Kheerganga Trek',
    location: 'Parvati Valley, Himachal',
    duration: '2 Days',
    difficulty: 'Easy',
    price: '₹1,000',
    image: '/assets/kheerganga.jpg',
    imagePosition: 'top',
    guideName: 'Pritam Negi',
    guideAvatar: '/assets/pritam-photo-edited.png',
    badges: ['Hot Springs', 'Scenic'],
    category: 'Trekking',
    overview: 'The Kheerganga Trek is one of the most popular treks in Himachal Pradesh, perfect for beginners and solo travelers. Located in the mystical Parvati Valley at an altitude of 9,700 ft, this trek rewards you with natural hot water springs believed to have healing properties. The trail passes through dense pine forests, charming Himachali villages, and offers stunning views of the Parvati River. Legend has it that Lord Shiva meditated here for 3,000 years, making it a spiritually significant destination.',
    highlights: [
        'Soak in natural hot water springs at the summit',
        'Trek through lush pine and deodar forests',
        'Visit the sacred Shiva temple at Kheerganga',
        'Witness the stunning Rudra Nag waterfall',
        'Camp under star-studded Himalayan skies',
        'Experience the vibrant culture of Parvati Valley villages'
    ],
    guides: [
        {
            id: 'g2',
            name: 'Pritam Negi',
            avatar: '/assets/pritam-photo-edited.png',
            experience: '6 Years',
            languages: ['English', 'Hindi', 'Pahadi'],
            rating: 4.8,
            reviews: 65,
            description: 'A local from Tosh village, Pritam has been guiding trekkers through the Parvati Valley since his early twenties. His knowledge of local trails and hidden spots makes every trek memorable.'
        }
    ],
    companies: [
        {
            id: '37d12bd9-a1ff-40f0-996d-b04c7ae2bfd5',
            name: 'Pritam tour and travels 99',
            logo: '/assets/pritam-tour.png',
            description: 'A trusted local partner specializing in group departures and customized treks across the Himalayas.',
            rating: 5.0,
            establishedYear: 2015
        }
    ],
    itinerary: [
        {
            day: 1,
            title: 'Barshaini to Kheerganga via Nakthan & Rudra Nag',
            description: 'Start early from Barshaini and begin your trek along the Parvati River. The trail passes through the picturesque village of Nakthan with its traditional wooden houses. Continue through dense pine forests to reach the beautiful Rudra Nag waterfall – a perfect spot for a break. The final stretch is a steep climb through rhododendron trees before you reach the magical meadows of Kheerganga. End the day with a rejuvenating dip in the natural hot springs.',
            distance: '12 km',
            elevation: '9,700 ft'
        },
        {
            day: 2,
            title: 'Kheerganga to Barshaini & Departure',
            description: 'Wake up to a stunning Himalayan sunrise. After breakfast, visit the ancient Shiva temple and take one last soak in the hot springs. Begin your descent back to Barshaini – the downhill trek is easier and offers different perspectives of the valley. Reach Barshaini by afternoon where your trek concludes with unforgettable memories.',
            distance: '12 km',
            elevation: '7,500 ft'
        }
    ],
    gallery: [
        '/assets/kheerganga/1.jpg',
        '/assets/kheerganga/2.jpg',
        '/assets/kheerganga/3.jpg',
        '/assets/kheerganga/4.jpg',
        '/assets/kheerganga/5.jpg',
        '/assets/kheerganga/6.jpg',
        '/assets/kheerganga.jpg'
    ]
};
