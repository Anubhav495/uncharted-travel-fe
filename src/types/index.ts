export interface FeaturePreferences {
    [key: string]: boolean;
}

export interface Guide {
    name: string;
    location: string;
    specialty: string;
    quote: string;
    tags: string[];
    imageUrl: string;
}

export interface Review {
    name: string;
    avatarUrl: string;
    rating: number;
    tour: string;
    quote: string;
}