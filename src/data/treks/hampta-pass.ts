import { Trek } from '@/types/trek';

export const hamptaPassTrek: Trek = {
    id: 'hampta-pass',
    slug: 'hampta-pass',
    title: 'Hampta Pass Trek',
    providerName: 'Uncharted Travel',
    price: '₹9,500',
    duration: '5 Days / 4 Nights',
    difficulty: 'Moderate',
    maxAltitude: '14,100 ft',
    basecamp: 'Manali, Himachal Pradesh',
    location: 'Kullu & Lahaul Spiti, Himachal Pradesh',
    trekDistance: '25 km',
    bestTimeToVisit: 'Mid June to October',
    theme: 'Crossover, Valleys, Desert',
    image: '/assets/images/treks/hampta-pass/cover.jpg',
    heroImage: '/assets/images/treks/hampta-pass/cover.jpg',
    imagePosition: 'center',
    badges: ['Crossover', 'Glacier', 'Popular'],
    category: 'Trekking',
    guides: [],
    companies: [],
    overview: 'The Hampta Pass trek is arguably the most dramatic crossover trek in the Himalayas. It connects the lush green Kullu Valley with the stark, barren landscapes of Lahaul. The sudden shift in scenery from dense pine forests and expansive meadows to a rugged, cold desert is breathtaking.',
    shortDescription: 'A dramatic crossover from the lush Kullu Valley to the barren deserts of Lahaul.',
    highlights: [
        'Witness a dramatic shift in landscapes from lush green valleys to cold deserts.',
        'Cross two icy glacial rivers on foot.',
        'Camp at iconic sites like Balu Ka Ghera and Shea Goru.',
        'Experience the thrill of a 14,100 ft pass crossing.'
    ],
    itinerary: [
        {
            day: 1,
            title: 'Manali to Jobra, Trek to Chika',
            description: 'Drive from Manali to Jobra (9,800 ft), then begin a short 2 km trek to the Chika campsite (10,100 ft) walking through mixed forests of pine, green maple, and birch.'
        },
        {
            day: 2,
            title: 'Chika to Balu Ka Ghera',
            description: 'Trek from Chika to Balu Ka Ghera (11,900 ft). A relatively flat walk along the river banks with spectacular views of the Dhauladhar ranges.'
        },
        {
            day: 3,
            title: 'Balu Ka Ghera to Shea Goru via Hampta Pass',
            description: 'The most challenging day. Trek from Balu Ka Ghera, cross the Hampta Pass at 14,100 ft, and descend steeply to Shea Goru (12,900 ft) into the Lahaul valley.'
        },
        {
            day: 4,
            title: 'Shea Goru to Chhatru',
            description: 'Descend from Shea Goru to Chhatru (11,000 ft). Cross the icy river and walk alongside the Chandra river to reach the campsite.'
        },
        {
            day: 5,
            title: 'Chhatru to Chandratal and back to Manali',
            description: 'If the roads are open, visit the stunning Chandratal Lake in the morning before driving back to Manali via the Rohtang Pass or Atal Tunnel.'
        }
    ],
    inclusions: [
        'Accommodation in high-quality dome tents (2-3 sharing)',
        'Nutritious, hot vegetarian meals during the trek',
        'Expert Trek Leader and support staff',
        'All necessary permits and entry fees',
        'Microspikes and gaiters (if required)',
        'First aid kit, oxygen cylinder, and stretcher for emergencies'
    ],
    exclusions: [
        'Transport to and from Manali (Basecamp)',
        'Backpack offloading (can be opted for at an extra cost)',
        'Meals during transit (Manali to Jobra and Chhatru to Manali)',
        'Any personal expenses or insurance'
    ],
    gallery: [
        '/assets/images/treks/hampta-pass/gallery-1.jpg',
        '/assets/images/treks/hampta-pass/gallery-2.jpg',
        '/assets/images/treks/hampta-pass/gallery-3.jpg',
        '/assets/images/treks/hampta-pass/gallery-4.jpg'
    ]
};
