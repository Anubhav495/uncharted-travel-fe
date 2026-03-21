export interface Guide {
    id: string;
    name: string;
    avatar: string;
    experience: string;
    languages: string[];
    rating: number;
    description: string;
}

export interface Company {
    id: string;
    name: string;
    logo: string;
    description: string;
    rating: number;
    establishedYear: number;
    itinerary?: ItineraryDay[];
}

export interface ItineraryDay {
    day: number;
    title: string;
    description: string;
    elevation?: string;
    distance?: string;
    meals?: string;
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
    imagePosition?: 'top' | 'center' | 'bottom';
    guideName: string; // Keeping for backward compatibility or primary guide
    guideAvatar: string;
    badges: string[];
    category: 'All' | 'Expedition' | 'Cultural' | 'Trekking' | 'Relaxed';
    overview?: string;
    highlights?: string[];
    guides?: Guide[];
    companies?: Company[];
    itinerary?: ItineraryDay[];
    gallery?: string[];
}
