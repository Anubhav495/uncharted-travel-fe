import { Trek } from '@/types/trek';

export const sarPassTrek: Trek = {
    id: '1',
    slug: 'sar-pass-trek',
    title: 'Sar Pass Trek',
    location: 'Parvati Valley, Himachal',
    duration: '5 Days',
    difficulty: 'Moderate',
    price: '₹9,500',
    image: '/assets/sar-pass.png',
    imagePosition: 'center',
    guideName: 'Tenzin',
    guideAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
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
            id: 'g1',
            name: 'Tenzin Norgay',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
            experience: '8 Years',
            languages: ['English', 'Hindi', 'Tibetan'],
            rating: 4.9,
            description: 'Born in the Parvati Valley, Tenzin has been guiding treks since he was 18. He knows every hidden trail and folklore of the mountains.'
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
        'https://images.unsplash.com/photo-1519681393784-d120267933ba?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1486870591958-9b9d0d1dda99?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1454496522488-7a8e488e8606?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1551632811-561732d1e306?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1491555103944-7c647fd857e6?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1434394354979-a235cd36269d?q=80&w=1200&auto=format&fit=crop',
        'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=1200&auto=format&fit=crop'
    ]
};
