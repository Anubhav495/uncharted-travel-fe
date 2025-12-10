export interface Trek {
    id: string;
    title: string;
    location: string;
    duration: string;
    difficulty: 'Easy' | 'Moderate' | 'Hard' | 'Expert';
    price: string;
    image: string;
    guideName: string;
    guideAvatar: string;
    badges: string[];
    category: 'All' | 'Expedition' | 'Cultural' | 'Trekking' | 'Relaxed';
}

export const treks: Trek[] = [
    {
        id: '1',
        title: 'Spiti Valley Expedition',
        location: 'Himachal Pradesh',
        duration: '7 Days',
        difficulty: 'Moderate',
        price: '₹18,500',
        image: 'https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?q=80&w=2070&auto=format&fit=crop',
        guideName: 'Tenzin',
        guideAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=100&auto=format&fit=crop',
        badges: ['Best Seller', 'High Altitude'],
        category: 'Expedition'
    },
    {
        id: '2',
        title: 'Chadar Frozen River Trek',
        location: 'Ladakh',
        duration: '9 Days',
        difficulty: 'Expert',
        price: '₹25,000',
        image: 'https://images.unsplash.com/photo-1548013146-72479768bada?q=80&w=1776&auto=format&fit=crop',
        guideName: 'Dorje',
        guideAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=100&auto=format&fit=crop',
        badges: ['Extreme', 'Winter Only'],
        category: 'Expedition'
    },
    {
        id: '3',
        title: 'Valley of Flowers',
        location: 'Uttarakhand',
        duration: '6 Days',
        difficulty: 'Easy',
        price: '₹12,000',
        image: 'https://images.unsplash.com/photo-1588392382834-a891154bca4d?q=80&w=2076&auto=format&fit=crop',
        guideName: 'Priya',
        guideAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
        badges: ['Floral', 'Monsoon'],
        category: 'Trekking'
    },
    {
        id: '4',
        title: 'Meghalaya Living Root Bridges',
        location: 'Meghalaya',
        duration: '5 Days',
        difficulty: 'Moderate',
        price: '₹15,000',
        image: 'https://images.unsplash.com/photo-1623660032723-524671408e0e?q=80&w=1974&auto=format&fit=crop',
        guideName: 'Wanphrang',
        guideAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=100&auto=format&fit=crop',
        badges: ['Cultural', 'Jungle'],
        category: 'Cultural'
    },
    {
        id: '5',
        title: 'Hampta Pass Trek',
        location: 'Manali',
        duration: '5 Days',
        difficulty: 'Moderate',
        price: '₹14,500',
        image: 'https://images.unsplash.com/photo-1624821588855-a5ff39965646?q=80&w=2070&auto=format&fit=crop',
        guideName: 'Ravi',
        guideAvatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=100&auto=format&fit=crop',
        badges: ['Crossover', 'Scenery'],
        category: 'Trekking'
    },
    {
        id: '6',
        title: 'Kedarkantha Trek',
        location: 'Uttarakhand',
        duration: '6 Days',
        difficulty: 'Easy',
        price: '₹11,500',
        image: 'https://images.unsplash.com/photo-1612438214708-f428a707dd4e?q=80&w=1974&auto=format&fit=crop',
        guideName: 'Arjun',
        guideAvatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?q=80&w=100&auto=format&fit=crop',
        badges: ['Snow', 'Summit'],
        category: 'Trekking'
    }
];
