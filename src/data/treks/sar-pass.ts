import { Trek } from '@/types/trek';

export const sarPassTrek: Trek = {
    id: '1',
    slug: 'sar-pass-trek',
    title: 'Sar Pass Trek',
    location: 'Parvati Valley, Himachal',
    duration: '5 Days',
    difficulty: 'Moderate',
    price: '₹6,500',
    image: '/assets/sar-pass/3.jpg',
    imagePosition: 'center',
    guideName: 'Pritam Negi',
    guideAvatar: '/assets/pritam-photo-edited.png',
    badges: ['Snow', 'Forest'],
    category: 'Trekking',
    overview: 'The Sar Pass Trek is a classic beginner-friendly trek in the Parvati Valley of Himachal Pradesh. "Sar" in the local dialect means a lake. While trekking across the path from Tila Lotni to Biskeri Ridge, one has to pass by a small frozen lake (Sar) and hence the name Sar Pass Trek. The trail takes you through dense pine forests, lush green meadows, and tiny hamlets, offering breathtaking views of the Himalayan peaks.',
    highlights: [
        'traverse through dense pine and rhododendron forests',
        'Spectacular views of the Parvati Valley',
        'Experience the local culture of Grahan Village',
        'Cross the frozen Sar Lake at 13,800 ft',
        'Slide down snow slopes during the descent'
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
            title: 'Arrival in Kasol & Trek to Grahan Village',
            description: 'Start your journey from the colorful town of Kasol. The trail winds through dense pine forests and follows the Grahan Nal (stream). It is a gentle climb offering beautiful views of the valley. Grahan is a traditional village with distinct wooden architecture.',
            distance: '10 km',
            elevation: '7,700 ft'
        },
        {
            day: 2,
            title: 'Grahan to Min Thach',
            description: 'The trail today becomes steeper as you head towards Min Thach. You will walk through thick forests of Deodar and Oak. As the forest clears, you reach the meadow of Min Thach, offering stunning views of Chanderkhani Stretch and other peaks.',
            distance: '7 km',
            elevation: '11,200 ft'
        },
        {
            day: 3,
            title: 'Min Thach to Nagaru',
            description: 'A short but steep climb today. The air gets thinner and the views get wider. You reach Nagaru, the highest campsite of the trek. It can get windy and cold here, but the sunset over the mountains is magical.',
            distance: '8 km',
            elevation: '12,500 ft'
        },
        {
            day: 4,
            title: 'Nagaru to Biskeri Thach via Sar Pass',
            description: 'The big day! Start early to cross the Sar Pass. The climb is steep through snow. At the top (13,800 ft), enjoy 360-degree views of the Himalayas. The descent involves an exciting slide down the snow slopes to reach the lush green meadows of Biskeri Thach.',
            distance: '14 km',
            elevation: '13,800 ft'
        },
        {
            day: 5,
            title: 'Biskeri Thach to Barshaini via Pulga',
            description: 'A gentle descent through dense pine forests. You will pass through the quaint village of Pulga before reaching Barshaini. The trek ends here with a bag full of memories.',
            distance: '6 km',
            elevation: '7,800 ft'
        }
    ],
    gallery: [
        '/assets/sar-pass/3.jpg',
        '/assets/sar-pass.png',
        '/assets/sar-pass/sar-pass-trek-2.webp',
        '/assets/sar-pass/sar-pass-trek-3.jpeg',
        '/assets/sar-pass/sar-pass-trek-4.jpeg'
    ]
};
