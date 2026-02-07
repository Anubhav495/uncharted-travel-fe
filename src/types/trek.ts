export interface Guide {
    id: string;
    name: string;
    avatar: string;
    experience: string;
    languages: string[];
    rating: number;
    description: string;
}

export interface ItineraryDay {
    day: number;
    title: string;
    description: string;
    elevation?: string;
    distance?: string;
}

export interface Trek {
    id: string;
    slug: string;
    title: string;
    location: string;
    duration: string;
    difficulty: 'Easy' | 'Moderate' | 'Hard' | 'Expert';
    price: string;
    image: string;
    guideName: string; // Keeping for backward compatibility or primary guide
    guideAvatar: string;
    badges: string[];
    category: 'All' | 'Expedition' | 'Cultural' | 'Trekking' | 'Relaxed';
    overview?: string;
    highlights?: string[];
    guides?: Guide[];
    itinerary?: ItineraryDay[];
    gallery?: string[];
}
