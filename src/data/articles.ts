/**
 * Article data — src/data/articles.ts
 * Modelled on src/data/treks/. All facts sourced from trek data only.
 * No CMS. Generated as static pages via pages/articles/[slug].tsx.
 */

export interface ArticleFaqItem {
    question: string;
    answer: string;
}

export interface ArticleFactRow {
    label: string;
    value: string;
}

export interface ArticleSection {
    heading: string;
    body: string; // markdown-style paragraphs, separated by \n\n
}

export interface Article {
    slug: string;
    title: string;
    targetKeyword: string;
    excerpt: string; // 40-60 words, the direct answer — shown first on page
    trekSlugs: string[]; // links to trek pages
    guideAuthor: string; // real guide name from data, or 'Uncharted Travel Team'
    publishedDate: string; // ISO date string
    updatedDate: string; // ISO date string
    category: 'Guide' | 'Comparison' | 'Planning' | 'Seasonal';
    sections: ArticleSection[];
    faqs: ArticleFaqItem[];
    facts: ArticleFactRow[];
}

export const articles: Article[] = [
    {
        slug: 'sar-pass-trek-cost-itinerary',
        title: 'Sar Pass Trek Cost, Itinerary and Difficulty: Complete Guide from Kasol',
        targetKeyword: 'sar pass trek cost itinerary',
        excerpt:
            'The Sar Pass Trek costs ₹6,500 per person and covers 5 days from Kasol in Parvati Valley, Himachal Pradesh. Rated Moderate, it suits trekkers with basic fitness and takes you through pine forests, meadows, and over a 13,800 ft snow pass.',
        trekSlugs: ['sar-pass-trek'],
        guideAuthor: 'Pritam Negi',
        publishedDate: '2026-11-01',
        updatedDate: '2026-11-01',
        category: 'Guide',
        facts: [
            { label: 'Price', value: '₹6,500 per person' },
            { label: 'Duration', value: '5 Days' },
            { label: 'Difficulty', value: 'Moderate' },
            { label: 'Location', value: 'Parvati Valley, Himachal Pradesh' },
            { label: 'Max Altitude', value: '13,800 ft (Sar Pass)' },
            { label: 'Starts From', value: 'Kasol' },
            { label: 'Ends At', value: 'Barshaini' },
        ],
        sections: [
            {
                heading: 'What is the Sar Pass Trek?',
                body: 'The Sar Pass Trek is a classic Himalayan trek in the Parvati Valley of Himachal Pradesh. "Sar" in the local Pahadi dialect means lake — the route passes a small frozen lake near the pass at 13,800 ft, which gives the trek its name.\n\nThe trail starts from the colourful town of Kasol and winds through dense pine forests, the traditional village of Grahan, open meadows, and high snow slopes before crossing the pass and descending to Barshaini via Pulga.',
            },
            {
                heading: 'Sar Pass Trek Cost — What Does ₹6,500 Include?',
                body: 'The Sar Pass Trek on Uncharted Travel starts at ₹6,500 per person when booked with a local guide. This covers the guide\'s services throughout the 5-day route.\n\nAdditional costs you should budget for include transport from Delhi or Chandigarh to Kasol, food during the trek (if not included in your package), camping equipment, and return transport from Barshaini. Confirm exact inclusions with your guide before departing.',
            },
            {
                heading: 'Day-by-Day Sar Pass Trek Itinerary',
                body: 'Day 1 — Kasol to Grahan Village (10 km, 7,700 ft): The trail follows the Grahan Nal stream through dense pine forest. Grahan is a traditional village with distinctive wooden architecture.\n\nDay 2 — Grahan to Min Thach (7 km, 11,200 ft): A steeper climb through Deodar and Oak forests leading to open meadows with views of the Chanderkhani Stretch.\n\nDay 3 — Min Thach to Nagaru (8 km, 12,500 ft): A short but steep day. Nagaru is the highest campsite. Cold and windy, but spectacular sunsets.\n\nDay 4 — Nagaru to Biskeri Thach via Sar Pass (14 km, 13,800 ft): The centrepiece day. An early start for a steep snow climb to the pass. From the top, 360-degree views of the Himalayas. The descent includes an exciting snow slide to the meadows of Biskeri Thach.\n\nDay 5 — Biskeri Thach to Barshaini via Pulga (6 km, 7,800 ft): A gentle descent through pine forest and the village of Pulga before reaching Barshaini where the trek ends.',
            },
            {
                heading: 'Sar Pass Trek Difficulty — Is It Right for You?',
                body: 'The Sar Pass Trek is rated Moderate. You should have a reasonable level of cardiovascular fitness and be comfortable walking 6–14 km per day on uneven terrain. No technical climbing skills are required.\n\nDay 4 (the pass crossing) is the most demanding. The snow section before the pass can be steep and slippery. Your guide will assess conditions and carry equipment to ensure safety.\n\nBeginners who have done day hikes regularly and are comfortable with some altitude can complete this trek. If you have never trekked before, consider starting with the Kheerganga Trek (₹999, Easy) in the same valley first.',
            },
        ],
        faqs: [
            {
                question: 'How much does the Sar Pass Trek cost?',
                answer: 'The Sar Pass Trek starts at ₹6,500 per person for the 5-day route from Kasol. This covers the local guide. Transport, food, and personal equipment are usually separate — confirm inclusions with your guide.',
            },
            {
                question: 'How difficult is Sar Pass Trek?',
                answer: 'Moderate. Suitable for trekkers with basic fitness. Day 4 (the pass crossing at 13,800 ft) is the hardest segment, involving a steep snow climb. No technical skills are required.',
            },
            {
                question: 'When is the best time to do the Sar Pass Trek?',
                answer: 'TODO: owner to confirm best season for Sar Pass. Generally, May–June (before monsoon) and September–October (after monsoon) are popular windows in Parvati Valley.',
            },
            {
                question: 'Where does the Sar Pass Trek start and end?',
                answer: 'The trek starts from Kasol (Parvati Valley) and ends at Barshaini. Both are reachable from Bhuntar, which has the nearest airport.',
            },
            {
                question: 'Who is the guide for the Sar Pass Trek?',
                answer: 'Pritam Negi, a local from Tosh village with 8 years of guiding experience in the Parvati Valley, leads this trek on Uncharted Travel.',
            },
        ],
    },
    {
        slug: 'hampta-pass-vs-sar-pass',
        title: 'Hampta Pass vs Sar Pass: Which Trek Should You Choose?',
        targetKeyword: 'hampta pass vs sar pass trek',
        excerpt:
            'Hampta Pass (₹9,500, 5 days, Moderate, 14,100 ft max) offers a dramatic Himalayan crossover from Kullu to Lahaul. Sar Pass (₹6,500, 5 days, Moderate, 13,800 ft max) is a classic forest-and-snow trek in Parvati Valley. Both suit moderate-fitness trekkers; Hampta gives wilder landscapes, Sar Pass gives more culture.',
        trekSlugs: ['hampta-pass', 'sar-pass-trek'],
        guideAuthor: 'Pritam Negi',
        publishedDate: '2026-11-01',
        updatedDate: '2026-11-01',
        category: 'Comparison',
        facts: [
            { label: 'Hampta Pass Price', value: '₹9,500 per person' },
            { label: 'Sar Pass Price', value: '₹6,500 per person' },
            { label: 'Both Duration', value: '5 Days' },
            { label: 'Both Difficulty', value: 'Moderate' },
            { label: 'Hampta Max Altitude', value: '14,100 ft' },
            { label: 'Sar Pass Max Altitude', value: '13,800 ft' },
            { label: 'Hampta Base', value: 'Manali, Himachal Pradesh' },
            { label: 'Sar Pass Base', value: 'Kasol, Parvati Valley' },
        ],
        sections: [
            {
                heading: 'Quick Comparison',
                body: 'Both Hampta Pass and Sar Pass are 5-day Moderate treks in Himachal Pradesh, making them direct competitors for the same type of trekker. The key difference is landscape and experience — Hampta Pass is a crossover trek with extreme variety (green valleys to cold desert), while Sar Pass is a more traditional snow-pass trek through forests and meadows.',
            },
            {
                heading: 'Hampta Pass Trek: What to Expect',
                body: 'The Hampta Pass Trek (₹9,500) connects the lush Kullu Valley with the stark, barren Lahaul desert landscape. The pass itself is at 14,100 ft and you cross two glacial rivers on the way. The most dramatic moment is the sudden scenery change on Day 3 as you descend into Lahaul.\n\nBased in Manali, with a 25 km total route, this trek has better infrastructure around the basecamp. Best time is Mid June to October.',
            },
            {
                heading: 'Sar Pass Trek: What to Expect',
                body: 'The Sar Pass Trek (₹6,500) starts from Kasol — the backpacker heart of the Parvati Valley. The trail is more forested and cultural, passing through the traditional village of Grahan and cresting the 13,800 ft Sar Pass before sliding down snow slopes to Biskeri Thach.\n\nThe ending at Barshaini puts you near Kheerganga and the rest of the Parvati Valley circuit — useful if you want to extend your trip.',
            },
            {
                heading: 'Which One Should You Choose?',
                body: 'Choose Hampta Pass if you want a dramatic crossover experience with stark contrasts, glacier river crossings, and a desert finish near Spiti. It\'s more expensive (₹9,500 vs ₹6,500) and has slightly higher altitude (14,100 ft vs 13,800 ft).\n\nChoose Sar Pass if you prefer a forest-and-culture experience, want to spend more time in the Parvati Valley, are on a tighter budget, or are combining it with a trip to Kasol or Kheerganga.',
            },
        ],
        faqs: [
            {
                question: 'Which is harder — Hampta Pass or Sar Pass?',
                answer: 'Both are rated Moderate. Hampta Pass has a slightly higher maximum altitude (14,100 ft vs 13,800 ft) and involves glacial river crossings. Sar Pass has a steeper snow section on Day 4. Both are comparable in overall difficulty.',
            },
            {
                question: 'Which is more expensive?',
                answer: 'Hampta Pass Trek costs ₹9,500 per person. Sar Pass Trek costs ₹6,500 per person. Both are 5-day Moderate treks.',
            },
            {
                question: 'Can I do both in one trip?',
                answer: 'Technically yes — Manali (Hampta base) and Kasol (Sar Pass base) are both in Himachal Pradesh, roughly 4-5 hours apart. Allow at least 12-14 days for both with rest days. Contact us for combined itinerary advice.',
            },
        ],
    },
    {
        slug: 'kedarkantha-winter-trek-guide',
        title: 'Kedarkantha Winter Trek: Cost, Difficulty, Packing and Best Time',
        targetKeyword: 'kedarkantha winter trek guide',
        excerpt:
            'Kedarkantha Trek costs ₹3,500 per person for a 4-day Moderate trek from Sankri, Uttarakhand. The summit at 12,500 ft is one of the finest winter climbs in the Himalayas, offering 360-degree views of Swargarohini, Black Peak, and Bandarpoonch. Best done December to March for snow.',
        trekSlugs: ['kedarkantha-trek'],
        guideAuthor: 'Kapil Rawat',
        publishedDate: '2026-11-01',
        updatedDate: '2026-11-01',
        category: 'Seasonal',
        facts: [
            { label: 'Price', value: '₹3,500 per person' },
            { label: 'Duration', value: '4 Days' },
            { label: 'Difficulty', value: 'Moderate' },
            { label: 'Location', value: 'Sankri, Uttarakhand' },
            { label: 'Summit Altitude', value: '12,500 ft' },
            { label: 'Guide', value: 'Kapil Rawat (8 Years experience)' },
        ],
        sections: [
            {
                heading: 'Why Kedarkantha Is the Best Winter Trek in India',
                body: 'Kedarkantha is one of the very few Himalayan treks that is better in winter than in summer. The summit, at 12,500 ft, is blanketed in deep snow from December to March, and the sunrise view from the top — 360 degrees of snow-capped peaks including Swargarohini, Black Peak, and Bandarpoonch — is consistently ranked among the finest in the Himalayas.\n\nIt is also beginner-accessible in winter with the right gear and an experienced guide, making it a popular first "snow summit" for trekkers from across India.',
            },
            {
                heading: 'Kedarkantha Trek Itinerary (4 Days from Sankri)',
                body: 'Day 1 — Sankri to Juda-ka-Talab (4 km, 9,100 ft): Trek through dense pine forests to reach the beautiful frozen lake campsite. In winter, Juda-ka-Talab is often fully iced over.\n\nDay 2 — Juda-ka-Talab to Base Camp (4 km, 11,250 ft): A shorter day trekking above the treeline with sweeping valley views to reach the base camp at 11,250 ft.\n\nDay 3 — Summit (12,500 ft) and descent to Hargaon (6 km): Start before dawn to summit for sunrise. The climb is steep through snow. From the top, 360-degree Himalayan panorama. Descend to Hargaon through apple orchards.\n\nDay 4 — Hargaon to Sankri (6 km, 6,400 ft): Gentle descent back to Sankri through forest and villages.',
            },
            {
                heading: 'What to Pack for the Kedarkantha Winter Trek',
                body: 'Warmth is critical. Temperatures at camp can drop below -10°C in January. Essential winter gear includes: thermal base layers (top and bottom), a down-insulated jacket, waterproof outer shell, warm gloves and a beanie, wool or synthetic hiking socks, and micro-spikes or crampons for the summit day.\n\nYour guide Kapil Rawat will advise on current snow conditions before departure and can help source gear in Sankri if needed.',
            },
        ],
        faqs: [
            {
                question: 'How much does Kedarkantha Trek cost?',
                answer: 'The Kedarkantha Trek costs ₹3,500 per person on Uncharted Travel. This covers the local guide Kapil Rawat for the 4-day trek from Sankri.',
            },
            {
                question: 'Is Kedarkantha Trek good for beginners?',
                answer: 'Yes, for reasonably fit beginners. It is rated Moderate — the summit day is demanding but achievable with a good guide and proper gear. It is not recommended for people with zero outdoor experience.',
            },
            {
                question: 'What is the best time for Kedarkantha Trek?',
                answer: 'TODO: owner to confirm. Generally December–March for snow and winter experience; April–June and September–November for clear trails and autumn/spring scenery.',
            },
            {
                question: 'How do I get to Sankri for the Kedarkantha Trek?',
                answer: 'The nearest major city is Dehradun. From Dehradun, take a shared taxi or private vehicle to Sankri (approximately 8-9 hours). Your guide Kapil Rawat is based in Sankri and can assist with logistics.',
            },
        ],
    },
    {
        slug: 'rupin-pass-difficulty-beginners',
        title: 'Is Rupin Pass Trek Safe for Beginners? Difficulty, Altitude and Preparation',
        targetKeyword: 'rupin pass trek difficulty beginners',
        excerpt:
            'Rupin Pass Trek is rated Hard — it is not suitable for first-time trekkers. The 7-day route from Shimla reaches 15,250 ft at the pass crossing, with steep snow walls and river crossings. Cost is ₹15,500 per person. Beginners should complete at least one Moderate trek before attempting Rupin Pass.',
        trekSlugs: ['rupin-pass-trek'],
        guideAuthor: 'Kapil Rawat',
        publishedDate: '2026-11-01',
        updatedDate: '2026-11-01',
        category: 'Guide',
        facts: [
            { label: 'Price', value: '₹15,500 per person' },
            { label: 'Duration', value: '7 Days' },
            { label: 'Difficulty', value: 'Hard' },
            { label: 'Location', value: 'Shimla, Himachal Pradesh → Uttarakhand' },
            { label: 'Pass Altitude', value: '15,250 ft' },
            { label: 'Guide', value: 'Kapil Rawat (8 Years experience)' },
        ],
        sections: [
            {
                heading: 'What Makes Rupin Pass Trek Hard?',
                body: 'The Rupin Pass Trek is rated Hard for three reasons: altitude (15,250 ft at the pass), length (7 days, 50+ km total), and technical difficulty (steep snow walls on the pass day that require confident footwork or microspikes, and glacial river crossings).\n\nThe most demanding day is Day 5 — the pass crossing. The ascent through the dramatic snow walls can be a scramble in early season, and the steep descent on the Uttarakhand side requires caution.',
            },
            {
                heading: 'Day-by-Day Rupin Pass Itinerary',
                body: 'Day 1: Shimla to Jiskun via Rohru (drive, 7,700 ft). Explore Jiskun village.\nDay 2: Jiskun to Saruwas Thatch — 8 km, 9,800 ft. Dense forests of oak and maple.\nDay 3: Saruwas Thatch to Upper Waterfall — 6 km, 11,800 ft. First views of the Rupin waterfall.\nDay 4: Upper Waterfall to Rati Pheri (base camp for pass) — 5 km, 13,600 ft. Acclimatise.\nDay 5: Rati Pheri to Rupin Pass (15,250 ft) to Ronti Gad — 10 km. The big crossing.\nDay 6: Ronti Gad to Sangla Valley — 12 km, 8,600 ft. Into Kinnaur district.\nDay 7: Sangla to Shimla (drive). Trek ends.',
            },
            {
                heading: 'Should a Beginner Attempt Rupin Pass?',
                body: 'No — not directly. Rupin Pass is a Hard trek and requires prior high-altitude experience. If you are keen to work towards it, the suggested progression is:\n\n1. Start with an Easy trek — Kheerganga (₹999) or Kareri Lake (₹1,500).\n2. Do a Moderate trek with some altitude — Kedarkantha (₹3,500, 12,500 ft) or Sar Pass (₹6,500, 13,800 ft).\n3. Then attempt Rupin Pass (₹15,500, 15,250 ft).\n\nThis progression usually takes 1-2 trekking seasons. Your guide Kapil Rawat will assess your fitness and experience before confirming the trek.',
            },
        ],
        faqs: [
            {
                question: 'Is Rupin Pass Trek suitable for beginners?',
                answer: 'No. Rupin Pass is rated Hard and reaches 15,250 ft. Prior experience with at least one Moderate high-altitude trek is strongly recommended. Complete Kedarkantha (12,500 ft) or Sar Pass (13,800 ft) first.',
            },
            {
                question: 'What is the cost of Rupin Pass Trek?',
                answer: '₹15,500 per person on Uncharted Travel, led by guide Kapil Rawat over 7 days from Shimla.',
            },
            {
                question: 'What is the highest point of Rupin Pass Trek?',
                answer: 'The Rupin Pass itself at 15,250 ft is the highest point. The daily campsites reach up to 13,600 ft at Rati Pheri.',
            },
            {
                question: 'Best time for Rupin Pass Trek?',
                answer: 'TODO: owner to confirm best season. Generally May–June and September–October are common windows, though exact conditions vary by year.',
            },
        ],
    },
    {
        slug: 'kheerganga-trek-guide',
        title: 'Kheerganga Trek from Barshaini: Cost, Route and Hot Springs Guide',
        targetKeyword: 'kheerganga trek from barshaini cost route',
        excerpt:
            'Kheerganga Trek costs ₹999 per person for a 2-day Easy trek from Barshaini in the Parvati Valley, Himachal Pradesh. The trail reaches natural hot springs at 9,700 ft. A sacred Shiva temple, the Rudra Nag waterfall, and pine forest make this the most popular beginner trek in Himachal.',
        trekSlugs: ['kheerganga-trek'],
        guideAuthor: 'Pritam Negi',
        publishedDate: '2026-11-01',
        updatedDate: '2026-11-01',
        category: 'Guide',
        facts: [
            { label: 'Price', value: '₹999 per person' },
            { label: 'Duration', value: '2 Days' },
            { label: 'Difficulty', value: 'Easy' },
            { label: 'Location', value: 'Parvati Valley, Himachal Pradesh' },
            { label: 'Altitude at Hot Springs', value: '9,700 ft' },
            { label: 'Starts From', value: 'Barshaini' },
            { label: 'Guide', value: 'Pritam Negi (8 Years experience)' },
        ],
        sections: [
            {
                heading: 'What is the Kheerganga Trek?',
                body: 'The Kheerganga Trek is the most popular beginner trek in Himachal Pradesh, drawing thousands of trekkers every year to the Parvati Valley. The destination — Kheerganga — is a high meadow at 9,700 ft known for its natural hot water springs, which are believed to have healing properties.\n\nAccording to local legend, Lord Shiva meditated here for 3,000 years. A sacred Shiva temple stands at the top, making this a pilgrimage route as much as a trek.',
            },
            {
                heading: 'Kheerganga Trek Route and Itinerary',
                body: 'Day 1 — Barshaini to Kheerganga (12 km, 9,700 ft): Start early from Barshaini. The trail follows the Parvati River and passes through the village of Nakthan. Continue through pine forest to the Rudra Nag waterfall — a great rest spot. The final stretch is a steep climb through rhododendron trees to the meadow. End the day soaking in the hot springs.\n\nDay 2 — Kheerganga to Barshaini (12 km, 7,500 ft): Wake up to a Himalayan sunrise. Visit the Shiva temple and take one final dip in the springs. Descend to Barshaini — the downhill route is quicker and offers fresh valley views.',
            },
            {
                heading: 'The Hot Springs at Kheerganga',
                body: 'The natural hot springs are the defining feature of the Kheerganga Trek. They flow year-round and are separated into different pools — some open-air and some covered. The springs are believed by local Himachali communities to carry healing properties, particularly for skin conditions.\n\nThe water is warm enough to soak in even in October–November. Treat the site with respect — it is considered sacred.',
            },
        ],
        faqs: [
            {
                question: 'How much does Kheerganga Trek cost?',
                answer: '₹999 per person on Uncharted Travel — the most affordable trek in our catalogue. Led by local guide Pritam Negi.',
            },
            {
                question: 'Is Kheerganga Trek suitable for beginners?',
                answer: 'Yes. It is rated Easy and is one of the best first treks in Himachal Pradesh. The 12 km one-way distance is manageable for anyone with basic walking fitness.',
            },
            {
                question: 'How do I get to Barshaini for the Kheerganga Trek?',
                answer: 'Take a bus or shared taxi from Kasol to Barshaini. Kasol is reachable from Bhuntar (nearest airport/bus hub) in about 30 minutes.',
            },
            {
                question: 'What is the best time for Kheerganga Trek?',
                answer: 'TODO: owner to confirm. Parvati Valley treks are generally done April–June and September–November. The hot springs are accessible year-round.',
            },
        ],
    },
    {
        slug: 'kareri-lake-trek-guide',
        title: 'Kareri Lake Trek: A 2-Day Easy Trek from Dharamshala',
        targetKeyword: 'kareri lake trek dharamshala easy',
        excerpt:
            'Kareri Lake Trek costs ₹1,500 per person for a 2-day Easy trek from Dharamshala, Himachal Pradesh. The glacial lake sits at 9,626 ft in the Dhauladhar range, surrounded by snow peaks. Guide Aatish, a local from the Dhauladhar foothills, leads this trek.',
        trekSlugs: ['kareri-lake-trek'],
        guideAuthor: 'Aatish',
        publishedDate: '2026-11-01',
        updatedDate: '2026-11-01',
        category: 'Guide',
        facts: [
            { label: 'Price', value: '₹1,500 per person' },
            { label: 'Duration', value: '2 Days' },
            { label: 'Difficulty', value: 'Easy' },
            { label: 'Location', value: 'Dharamshala, Himachal Pradesh' },
            { label: 'Lake Altitude', value: '9,626 ft' },
            { label: 'Guide', value: 'Aatish (7 Years experience)' },
        ],
        sections: [
            {
                heading: 'Kareri Lake: A Glacial Gem in the Dhauladhar',
                body: 'Kareri Lake is a pristine glacial lake at 9,626 ft in the Dhauladhar range, fed by snowmelt from surrounding peaks. Its turquoise waters perfectly reflect the snow-capped mountains around it — one of the most photogenic spots in Himachal Pradesh.\n\nThe trek from Dharamshala passes through oak, deodar, and rhododendron forests, with views of the Dhauladhar ridge opening up as you climb. The trail also passes through the settlements of Gaddi shepherds — a nomadic community who move their flocks through these mountains every season.',
            },
            {
                heading: 'Kareri Lake Trek Itinerary',
                body: 'Day 1 — Dharamshala to Kareri Village, trek to Lioti (8 km, 8,200 ft): Drive to Kareri Village (6,200 ft) and start the gradual forest climb to Lioti campsite. Dinner at camp.\n\nDay 2 — Lioti to Kareri Lake (6 km, 9,626 ft): Trek through rhododendron and birch forest above the treeline to the lake. Spend the afternoon at the lakeshore. Camp by the lake for a spectacular night under stars.\n\nDay 3 — Kareri Lake to Kareri Village, drive to Dharamshala (14 km, 6,200 ft): Morning sunrise over the lake. Descend to Kareri Village by early afternoon and drive back to Dharamshala.',
            },
        ],
        faqs: [
            {
                question: 'How much does Kareri Lake Trek cost?',
                answer: '₹1,500 per person on Uncharted Travel. Guide Aatish leads the 2-day trek from Dharamshala.',
            },
            {
                question: 'Is Kareri Lake Trek suitable for beginners?',
                answer: 'Yes — it is rated Easy. The maximum altitude is 9,626 ft and the daily distances are 6–14 km. Anyone with basic walking fitness can complete it.',
            },
            {
                question: 'How do I reach the Kareri Lake Trek starting point?',
                answer: 'Dharamshala / McLeod Ganj is the base. It is reachable by flight (Gaggal Airport) or by bus from Delhi (12–14 hours). From Dharamshala, a vehicle takes you to Kareri Village (30 minutes).',
            },
        ],
    },
    {
        slug: 'har-ki-dun-trek-guide',
        title: 'Har Ki Dun Trek from Sankri: Itinerary, Cost and Best Season',
        targetKeyword: 'har ki dun trek sankri itinerary cost',
        excerpt:
            'Har Ki Dun Trek costs ₹4,500 per person for a 5-day Moderate trek from Sankri, Uttarakhand. Known as the "Valley of Gods," the route passes ancient villages, the Supin River, and reaches the cradle-shaped Har Ki Dun valley at 11,700 ft. Guide Kapil Rawat leads this trek.',
        trekSlugs: ['har-ki-dun-trek'],
        guideAuthor: 'Kapil Rawat',
        publishedDate: '2026-11-01',
        updatedDate: '2026-11-01',
        category: 'Guide',
        facts: [
            { label: 'Price', value: '₹4,500 per person' },
            { label: 'Duration', value: '5 Days' },
            { label: 'Difficulty', value: 'Moderate' },
            { label: 'Location', value: 'Sankri, Uttarakhand' },
            { label: 'Valley Altitude', value: '11,700 ft' },
            { label: 'Guide', value: 'Kapil Rawat (8 Years experience)' },
        ],
        sections: [
            {
                heading: 'What is Har Ki Dun?',
                body: 'Har Ki Dun — "Valley of the Gods" — is a high-altitude cradle-shaped valley in the Govind Pashu Vihar National Park, Uttarakhand. The valley is steeped in mythology: it is said to be the route the Pandavas used to ascend to heaven in the Mahabharata.\n\nThe trek is notable for its ancient preserved villages, particularly Osla, which features stunning wooden architecture unchanged for centuries. Wildlife includes Himalayan black bear, musk deer, and numerous bird species.',
            },
            {
                heading: 'Har Ki Dun Trek Itinerary (5 Days)',
                body: 'Day 1 — Sankri to Pauni Garaat via Taluka (10 km, 8,200 ft): Brief drive to Taluka, then trek through forests along the Supin River.\n\nDay 2 — Pauni Garaat to Kalkatiyadhaar (7 km, 8,950 ft): Pass through Osla village with its ancient wooden architecture.\n\nDay 3 — Kalkatiyadhaar to Har Ki Dun valley and back (10 km, 11,700 ft): Reach the spectacular valley, explore, and return to camp.\n\nDay 4 — Kalkatiyadhaar to Pauni Garaat (7 km, 8,200 ft): Retrace steps downhill.\n\nDay 5 — Pauni Garaat to Sankri (10 km, 6,400 ft): Final day, return to Sankri.',
            },
        ],
        faqs: [
            {
                question: 'How much does Har Ki Dun Trek cost?',
                answer: '₹4,500 per person on Uncharted Travel — a 5-day Moderate trek led by Kapil Rawat from Sankri.',
            },
            {
                question: 'Is Har Ki Dun good for beginners?',
                answer: 'It is rated Moderate. If you have some walking fitness and have done a few day hikes, you can complete it. No previous trekking experience is strictly required, but the 10 km days are easier if you have some stamina.',
            },
            {
                question: 'What is special about Har Ki Dun?',
                answer: 'The valley is historically and ecologically unique — ancient villages like Osla have preserved Garhwali wooden architecture, and the Govind Pashu Vihar National Park around it is rich in Himalayan wildlife.',
            },
        ],
    },
    {
        slug: 'dev-roopa-trek-guide',
        title: 'Dev Roopa Trek: The Hidden Meadow Trek in Parvati Valley',
        targetKeyword: 'dev roopa trek parvati valley hidden meadow',
        excerpt:
            'Dev Roopa Trek costs ₹8,000 per person for a 5–6 day Moderate trek from Kasol, Himachal Pradesh. The route enters the Malana region and reaches the vast Dev Roopa meadows at 14,100 ft — a remote, pristine high-altitude grassland accessed by guides Pritam Negi and Bhojraj.',
        trekSlugs: ['dev-roopa-trek'],
        guideAuthor: 'Pritam Negi',
        publishedDate: '2026-11-01',
        updatedDate: '2026-11-01',
        category: 'Guide',
        facts: [
            { label: 'Price', value: '₹8,000 per person' },
            { label: 'Duration', value: '5 to 6 Days' },
            { label: 'Difficulty', value: 'Moderate' },
            { label: 'Location', value: 'Parvati Valley (Malana region), Himachal Pradesh' },
            { label: 'Meadow Altitude', value: '14,100 ft' },
            { label: 'Guides', value: 'Pritam Negi (8 Years), Bhojraj (5 Years)' },
        ],
        sections: [
            {
                heading: 'What is Dev Roopa?',
                body: '"Dev Roopa" translates roughly as "Descent of God" or "Divine Form." It is a vast, pristine high-altitude meadow in the Malana region of Parvati Valley, sitting at approximately 14,000 ft. Unlike the busy Kheerganga or Sar Pass corridors, Dev Roopa receives very few trekkers, making it a genuine offbeat destination.\n\nThe meadows are braided with glacial streams and offer expansive views of surrounding peaks. The Malana region around it has a unique culture — Malana village is known for its ancient democracy and distinct customs.',
            },
            {
                heading: 'Dev Roopa Trek Route and Itinerary',
                body: 'How to reach: From Kasol, drive towards Jari, then take a taxi towards Malana Dam. Trek from the roadhead to Waichin.\n\nDay 1: Kasol to Malana Dam, trek to Waichin.\nDay 2: Waichin to Mota Grahan — 10,200 ft.\nDay 3: Mota Grahan to Bogdi — 6 km, 12,500 ft. Above the treeline.\nDay 4: Bogdi to Dev Roopa meadows and back — 8 km, 14,100 ft. The highlight day.\nDay 5: Bogdi to Mota Grahan.\nDay 6: Trek to Malana Dam, drive to Kasol.',
            },
        ],
        faqs: [
            {
                question: 'How much does Dev Roopa Trek cost?',
                answer: '₹8,000 per person on Uncharted Travel — a 5 to 6 day Moderate trek led by Pritam Negi and Bhojraj from Kasol.',
            },
            {
                question: 'Is Dev Roopa Trek suitable for beginners?',
                answer: 'It is rated Moderate but reaches 14,100 ft — higher than Sar Pass. Prior trekking experience (at least one Easy or Moderate trek) is recommended. The route is remote with limited rescue access.',
            },
            {
                question: 'What makes Dev Roopa different from other Parvati Valley treks?',
                answer: 'It enters the Malana region and reaches genuine offbeat meadows at 14,100 ft that very few trekkers visit. It is more remote and requires more preparation than Kheerganga or Buni Buni Pass.',
            },
        ],
    },
    {
        slug: 'buni-buni-pass-trek-guide',
        title: 'Buni Buni Pass: A Short, Easy Alternative to Kheerganga',
        targetKeyword: 'buni buni pass trek alternative kheerganga',
        excerpt:
            'Buni Buni Pass Trek costs ₹2,499 per person for a 2–3 day Easy trek in Parvati Valley, Himachal Pradesh. Starting from Kalga, it reaches alpine meadows at ~11,000 ft with panoramic snow-peak views, then optionally descends to Kheerganga hot springs. A quiet alternative to the crowded Kheerganga trail.',
        trekSlugs: ['buni-buni-pass'],
        guideAuthor: 'Pritam Negi',
        publishedDate: '2026-11-01',
        updatedDate: '2026-11-01',
        category: 'Guide',
        facts: [
            { label: 'Price', value: '₹2,499 per person' },
            { label: 'Duration', value: '2-3 Days' },
            { label: 'Difficulty', value: 'Easy' },
            { label: 'Location', value: 'Parvati Valley, Himachal Pradesh' },
            { label: 'Pass Altitude', value: '~10,980 ft' },
            { label: 'Guide', value: 'Pritam Negi (8 Years experience)' },
        ],
        sections: [
            {
                heading: 'Why Buni Buni Pass Instead of Kheerganga?',
                body: 'Kheerganga has become extremely busy in season — hundreds of trekkers per day, crowded camps, and long queues at the hot springs. Buni Buni Pass (also written Bunbuni or Bhunbhuni) offers a quieter alternative in the same valley, reaching pristine alpine meadows at ~11,000 ft with fewer people on the trail.\n\nThe two treks can even be combined: ascend via Buni Buni Pass from Kalga, and descend to Kheerganga for the hot springs before returning to Barshaini.',
            },
            {
                heading: 'Buni Buni Pass Trek Itinerary',
                body: 'Day 1 — Kalga to Buni Buni Pass (8 km, 10,980 ft): Steep ascent from Kalga through dense forests. Emerge into the open alpine meadows of Bunbuni. Camp with panoramic views.\n\nDay 2 — Buni Buni Pass to Kheerganga (5 km, 9,700 ft): Descend towards Kheerganga. Views along the way are spectacular. Arrive at Kheerganga and soak in the hot springs.\n\nDay 3 — Kheerganga to Barshaini (12 km, 7,400 ft): Trek down the Parvati river to Barshaini and depart.',
            },
        ],
        faqs: [
            {
                question: 'How much does Buni Buni Pass Trek cost?',
                answer: '₹2,499 per person — a 2–3 day Easy trek led by Pritam Negi from Kalga in the Parvati Valley.',
            },
            {
                question: 'Is Buni Buni Pass suitable for beginners?',
                answer: 'Yes, rated Easy. The ascent on Day 1 is steep but manageable. Suitable for anyone who has done basic hiking.',
            },
            {
                question: 'Can I combine Buni Buni Pass with Kheerganga?',
                answer: 'Yes — the standard 3-day route descends from Buni Buni Pass to Kheerganga hot springs on Day 2, then continues to Barshaini on Day 3.',
            },
        ],
    },
    {
        slug: 'baraadsar-lake-trek-guide',
        title: 'Baraadsar Lake Trek: Remote 7-Day Trek on the Himachal-Uttarakhand Border',
        targetKeyword: 'baraadsar lake trek himachal uttarakhand',
        excerpt:
            'Baraadsar Lake Trek costs ₹20,999 per person for a suggested 7-day Hard trek from Sankri, Uttarakhand. The sacred lake sits at 14,108 ft on the Himachal–Uttarakhand border, reached via Kasla, Rala, and Devbhasa. Guide Kailash Rawat has 20 years of experience in this region.',
        trekSlugs: ['baraadsar-lake-trek'],
        guideAuthor: 'Kailash Rawat',
        publishedDate: '2026-11-01',
        updatedDate: '2026-11-01',
        category: 'Guide',
        facts: [
            { label: 'Price', value: '₹20,999 per person' },
            { label: 'Duration', value: '7 Days (suggested)' },
            { label: 'Difficulty', value: 'Hard' },
            { label: 'Location', value: 'Uttarkashi, Uttarakhand / Himachal Pradesh border' },
            { label: 'Lake Altitude', value: '14,108 ft (~4,300 m)' },
            { label: 'Guide', value: 'Kailash Rawat (20 Years experience)' },
        ],
        sections: [
            {
                heading: 'Baraadsar Lake — A Sacred Remote High-Alpine Lake',
                body: 'Baraadsar Lake sits at approximately 4,300 metres (14,108 ft) near the Uttarakhand–Himachal Pradesh border, between the Rupin and Supin valleys. Local communities consider it a sacred wish-fulfilling lake, and it remains relatively unknown compared to the more marketed Himalayan lakes.\n\nThe route via Kasla–Rala–Devbhasa is quieter and more authentic than commercial alternatives. Snow can be present on the ridge crossings even in early summer, and water sources are scarce on the higher sections — logistics require coordination with an experienced guide.',
            },
            {
                heading: 'Baraadsar Lake Trek Itinerary (7 Days)',
                body: 'Day 1: Arrive in Sankri, meet guide Kailash Rawat, check equipment.\nDay 2: Sankri to Kasla (vehicle), trek to Rala — 5 km, 7,546 ft.\nDay 3: Rala to Devbhasa via Daldhar ridges — 8 km, 11,975 ft. Views of Swargarohini and Kalanag.\nDay 4: Devbhasa to high camp via Baraadsar ridge. Snow-dependent — guide confirms camp.\nDay 5: Baraadsar Lake (14,108 ft) and begin descent — 14 km round trip. Spend time at the lake.\nDay 6: Descend towards Rala — 7–8 km, 8,840 ft.\nDay 7: Return to Kasla, drive to Sankri.',
            },
            {
                heading: 'Important Notes for Baraadsar Lake Trek',
                body: 'This trek is Hard. Do not attempt without prior high-altitude experience. The 7-day plan is suggested — your guide Kailash Rawat will confirm camps, water points, and return stages based on current snow, weather, and group pace. Allow extra days in your travel plan for route adjustments.\n\nWater is scarce on the high sections — carry supplies agreed with your guide before leaving the villages.',
            },
        ],
        faqs: [
            {
                question: 'How much does Baraadsar Lake Trek cost?',
                answer: '₹20,999 per person on Uncharted Travel — the highest-priced trek in our catalogue, led by veteran guide Kailash Rawat over a suggested 7 days.',
            },
            {
                question: 'Is Baraadsar Lake Trek suitable for beginners?',
                answer: 'No. It is rated Hard, reaches 14,108 ft, and involves remote camps with limited rescue access. Prior experience with at least one Hard or several Moderate treks is required.',
            },
            {
                question: 'Is the Baraadsar Lake itinerary fixed?',
                answer: 'No — the 7-day plan is a suggested itinerary. Guide Kailash Rawat will confirm camps, water arrangements, and return stages based on snow conditions and group pace.',
            },
        ],
    },
    {
        slug: 'best-time-himalayan-treks',
        title: 'Best Time for Himalayan Treks: Month-by-Month Guide for Himachal and Uttarakhand',
        targetKeyword: 'best time himalayan treks himachal uttarakhand',
        excerpt:
            'The best time for most Himalayan treks is May–June and September–October. Easy treks like Kheerganga (₹999) and Kareri Lake (₹1,500) are accessible spring to autumn. Winter (Dec–Mar) is ideal for snow treks like Kedarkantha (₹3,500). Hard treks like Rupin Pass (₹15,500) and Baraadsar Lake (₹20,999) suit experienced trekkers in peak season only.',
        trekSlugs: [
            'sar-pass-trek',
            'hampta-pass',
            'kedarkantha-trek',
            'har-ki-dun-trek',
            'rupin-pass-trek',
            'buni-buni-pass',
            'dev-roopa-trek',
            'kareri-lake-trek',
            'kheerganga-trek',
            'baraadsar-lake-trek',
        ],
        guideAuthor: 'Uncharted Travel Team',
        publishedDate: '2026-11-01',
        updatedDate: '2026-11-01',
        category: 'Planning',
        facts: [
            { label: 'Spring Season', value: 'April – June' },
            { label: 'Summer / Monsoon', value: 'July – August (most passes closed)' },
            { label: 'Autumn Season', value: 'September – November' },
            { label: 'Winter Season', value: 'December – March' },
            { label: 'Best for Snow', value: 'Kedarkantha: December – March' },
            { label: 'Best for Crossovers', value: 'Hampta Pass: Mid June – October' },
        ],
        sections: [
            {
                heading: 'Spring (April–June): Best All-Round Season',
                body: 'April to June is ideal for most treks listed on Uncharted Travel. Trails are clear of winter snow (at lower elevations), flowers are blooming, and temperatures are pleasant. Higher passes like Hampta Pass (open from Mid June) and Sar Pass become accessible from May onward.\n\nBest treks for spring: Kheerganga (₹999), Kareri Lake (₹1,500), Buni Buni Pass (₹2,499), Har Ki Dun (₹4,500), Sar Pass (₹6,500), Dev Roopa (₹8,000), Hampta Pass (₹9,500).',
            },
            {
                heading: 'Monsoon (July–August): High Passes Closed, Some Valleys Open',
                body: 'Most Himalayan passes are closed or dangerous during the July–August monsoon due to landslides, swollen rivers, and slippery trails. Treks in the rain-shadow areas — like parts of the Lahaul and Spiti valleys — can still be possible. Confirm conditions with your guide before planning a monsoon trek.\n\nKheerganga is popular in August as the Parvati Valley receives lighter rain than the outer Himalayan ranges.',
            },
            {
                heading: 'Autumn (September–October): Most Popular Season',
                body: 'September and October are the busiest and most popular months for Himalayan trekking. The monsoon has cleared, skies are crystal clear, visibility is at its best, and temperatures are comfortable at all altitudes.\n\nAll 10 treks on Uncharted Travel can be done in autumn. October is particularly recommended for Baraadsar Lake (₹20,999), Rupin Pass (₹15,500), and Hampta Pass (₹9,500) before the higher passes close.',
            },
            {
                heading: 'Winter (December–March): Snow Treks Only',
                body: 'Winter is the specialist season. Most passes above 12,000 ft are snowbound and inaccessible — but Kedarkantha (₹3,500, 12,500 ft) is at its finest in winter, with deep snow from December to March.\n\nKheerganga (₹999) remains accessible in winter for the hot springs, though the trail can be slippery. All other treks above 11,000 ft should only be attempted in winter with an experienced guide confirming current conditions.',
            },
        ],
        faqs: [
            {
                question: 'Which month is best for Himalayan treks?',
                answer: 'October is widely considered the best single month — clear skies post-monsoon, comfortable temperatures, and all trails accessible. May–June is the second-best window for spring colour.',
            },
            {
                question: 'Which treks are best in winter?',
                answer: 'Kedarkantha (₹3,500) is the standout winter trek — it is best done December to March for the full snow experience. Kheerganga (₹999) also remains accessible in winter.',
            },
            {
                question: 'When does Hampta Pass open?',
                answer: 'From trek data: Mid June to October. The pass can be blocked by snow before June.',
            },
            {
                question: 'Are any treks open year-round?',
                answer: 'Kheerganga (₹999, Easy, 9,700 ft) can be done most of the year. Confirm current conditions with guide Pritam Negi before planning a monsoon or deep-winter visit.',
            },
        ],
    },
    {
        slug: 'himalayan-trek-local-guide-vs-company',
        title: 'Local Guide vs Trekking Company in the Himalayas: Cost, Safety and What You Actually Get',
        targetKeyword: 'himalayan trek local guide vs trekking company',
        excerpt:
            'Booking a local guide (like Pritam Negi from Parvati Valley) costs significantly less than a large trekking company and gives you more personalised service, better local knowledge, and direct economic impact in the community. A company package costs 2–3× more but includes meals, equipment, and logistics. Uncharted Travel offers both — compare on each trek page.',
        trekSlugs: [
            'sar-pass-trek',
            'hampta-pass',
            'kedarkantha-trek',
            'har-ki-dun-trek',
            'kheerganga-trek',
            'kareri-lake-trek',
        ],
        guideAuthor: 'Uncharted Travel Team',
        publishedDate: '2026-11-01',
        updatedDate: '2026-11-01',
        category: 'Planning',
        facts: [
            { label: 'Kheerganga — Local Guide', value: '₹999 per person' },
            { label: 'Sar Pass — Local Guide', value: '₹6,500 per person' },
            { label: 'Hampta Pass — Local Guide', value: '₹9,500 per person' },
            { label: 'Guide commission to community', value: '100% — no middleman' },
        ],
        sections: [
            {
                heading: 'What a Local Guide Gives You',
                body: 'A verified local guide like Pritam Negi (Parvati Valley), Kapil Rawat (Sankri), or Kailash Rawat (Sankri) offers genuine expertise that no large company can replicate. They know the trail in every season, every weather condition, and in every mood of the mountain.\n\nPritam Negi, for example, grew up in Tosh village and has guided through Parvati Valley since his early twenties. He knows the hidden campsites, the local families who provide food in villages, and how to read the weather over the Chanderkhani ridge. A call-centre booking agent at a large company does not have this knowledge.\n\nLocal guides also keep 100% of the fee you pay — there is no corporate overhead, no middleman commission, and no markup.',
            },
            {
                heading: 'What a Trekking Company Gives You',
                body: 'A full-service trekking company (like the companies listed on some trek pages on Uncharted Travel) typically includes accommodation in organised tents, all meals, group kit like microspikes, and a structured safety protocol.\n\nFor treks like Hampta Pass (₹9,500 includes tent accommodation, meals, permits, and microspikes), the company model makes sense if you do not want to organise logistics yourself and prefer a group departure with structured support.\n\nCompany packages typically cost 2–3× a local guide fee when compared like-for-like, but include significantly more support.',
            },
            {
                heading: 'How Uncharted Travel Works',
                body: 'Uncharted Travel is a marketplace — we verify and list both individual local guides and local trekking companies. You contact them directly through the platform. We charge no booking fee.\n\nOn each trek page (for example, the Sar Pass Trek page or the Kareri Lake Trek page), you can choose between individual guides and companies, see their ratings, read their profiles, and send an enquiry. The guide or company responds directly — no call centres, no middlemen.',
            },
        ],
        faqs: [
            {
                question: 'Is it safe to trek with a local independent guide vs a company?',
                answer: 'Safety depends on the specific guide\'s experience, not on whether they work independently or through a company. All guides on Uncharted Travel are verified local professionals. Kailash Rawat has 20 years of experience leading Hard treks like Baraadsar Lake; Kapil Rawat has 8 years in the Garhwal Himalayas. Their local knowledge of weather, terrain, and emergency routes is what keeps you safe.',
            },
            {
                question: 'How much cheaper is a local guide vs a company?',
                answer: 'It varies by trek and services included. On Hampta Pass, the local guide fee (₹9,500) includes trek leadership; a full company package for the same route typically adds tent accommodation, all meals, permits, and kit for a higher total. Compare the specific listings on each trek page.',
            },
            {
                question: 'Can I find guides on Uncharted Travel?',
                answer: 'Yes — visit https://unchartedtravel.in/guides to see all verified local guides with their experience, languages, ratings, and the treks they lead.',
            },
        ],
    },    {
        "slug": "sar-pass-vs-kheerganga",
        "title": "Sar Pass vs Kheerganga: Beginner Trek Comparison in Parvati Valley",
        "targetKeyword": "sar pass vs kheerganga trek",
        "excerpt": "Kheerganga is a 2-day Easy trek costing ₹999 ending at natural hot springs (9,700 ft). Sar Pass is a 5-day Moderate trek costing ₹6,500 crossing a 13,800 ft snow pass. Both start in Parvati Valley with guide Pritam Negi; Kheerganga is ideal for first-timers, while Sar Pass suits trekkers ready for snow.",
        "trekSlugs": [
            "sar-pass-trek",
            "kheerganga-trek"
        ],
        "guideAuthor": "Pritam Negi",
        "publishedDate": "2026-11-01",
        "updatedDate": "2026-11-01",
        "category": "Comparison",
        "facts": [
            {
                "label": "Kheerganga Price",
                "value": "₹999 per person"
            },
            {
                "label": "Sar Pass Price",
                "value": "₹6,500 per person"
            },
            {
                "label": "Kheerganga Duration",
                "value": "2 Days"
            },
            {
                "label": "Sar Pass Duration",
                "value": "5 Days"
            },
            {
                "label": "Kheerganga Altitude",
                "value": "9,700 ft"
            },
            {
                "label": "Sar Pass Altitude",
                "value": "13,800 ft"
            },
            {
                "label": "Common Valley",
                "value": "Parvati Valley, Himachal"
            }
        ],
        "sections": [
            {
                "heading": "Two Parvati Valley Classics Compared",
                "body": "Parvati Valley in Himachal Pradesh is home to two of the state's most famous trails: Kheerganga and Sar Pass. While they share the same valley trailhead region near Barshaini and Kasol, they offer completely different trekking experiences.\n\nKheerganga is a short weekend trail celebrated for its natural hot water springs and social atmosphere. Sar Pass is a true multi-day high-altitude expedition that takes you deep into pine forests, high meadows, and over a glaciated pass."
            },
            {
                "heading": "Difficulty & Trail Demands",
                "body": "Kheerganga is rated Easy with 12 km each way on well-trodden village trails. Anyone with basic walking fitness can complete it in two days.\n\nSar Pass is rated Moderate across 5 days, traversing 10 km to Grahan, ascending past the treeline at Nagaru (12,500 ft), and crossing 13,800 ft on snow slopes. It requires endurance, warm layers, and prior walking experience."
            },
            {
                "heading": "Which Should You Book First?",
                "body": "If you have never set foot on a mountain trail, start with Kheerganga (₹999). It will test your basic stamina, let you experience overnight mountain camping, and reward you with soothing mineral hot springs.\n\nIf you have already done day hikes or beginner trails and want an authentic snow pass crossing with sliding descents, choose the Sar Pass Trek (₹6,500)."
            }
        ],
        "faqs": [
            {
                "question": "Which is cheaper: Kheerganga or Sar Pass?",
                "answer": "Kheerganga is ₹999 per person for 2 days; Sar Pass is ₹6,500 per person for 5 days."
            },
            {
                "question": "Can I do both treks back-to-back?",
                "answer": "Yes. Since both conclude around Barshaini or Kasol, you can do Kheerganga as a warm-up, take a rest day in Kasol, and proceed to Sar Pass with guide Pritam Negi."
            }
        ]
    },

    {
        "slug": "hampta-pass-trek-packing-list",
        "title": "Hampta Pass Trek Packing List: Everything You Need from Jobra to Chhatru",
        "targetKeyword": "hampta pass trek packing list",
        "excerpt": "The 5-day Hampta Pass crossover trek reaches 14,100 ft between Kullu and Lahaul. Key gear includes thermal base layers, a down jacket, waterproof trekking boots, microspikes or gaiters for snow patches, and warm gloves. Tents and meals are included in full packages starting at ₹9,500 from Manali.",
        "trekSlugs": [
            "hampta-pass"
        ],
        "guideAuthor": "Pritam Negi",
        "publishedDate": "2026-11-01",
        "updatedDate": "2026-11-01",
        "category": "Planning",
        "facts": [
            {
                "label": "Trek Duration",
                "value": "5 Days / 4 Nights"
            },
            {
                "label": "Max Altitude",
                "value": "14,100 ft"
            },
            {
                "label": "Basecamp",
                "value": "Manali, Himachal Pradesh"
            },
            {
                "label": "Price",
                "value": "₹9,500 per person"
            },
            {
                "label": "Best Months",
                "value": "Mid June to October"
            }
        ],
        "sections": [
            {
                "heading": "Clothing & Layering for Extreme Climate Shifts",
                "body": "Hampta Pass takes you from the humid, green pine forests of Kullu to the freezing, dry desert winds of Lahaul at Shea Goru and Chhatru. Dressing in layers is essential.\n\nCarry 2-3 quick-dry synthetic t-shirts, 1 mid-layer fleece jacket, and 1 heavy down jacket rated for sub-zero temperatures. At Shea Goru campsite, nighttime temperatures frequently drop below freezing."
            },
            {
                "heading": "Footwear & River Crossing Essentials",
                "body": "You need sturdy trekking boots with deep lugged soles and water resistance for navigating boulder fields and snow slopes near the pass.\n\nA crucial tip from guide Pritam Negi: carry a pair of quick-drying sandals or floaters for glacial river crossings near Shea Goru so your primary trekking socks and shoes stay completely dry."
            }
        ],
        "faqs": [
            {
                "question": "Are microspikes provided on Hampta Pass?",
                "answer": "In full operator packages (₹9,500), microspikes and gaiters are included when snow conditions demand them."
            },
            {
                "question": "What backpack capacity is needed?",
                "answer": "A 50L to 60L backpack with a waterproof rain cover is ideal for the 5-day trek."
            }
        ]
    },
    {
        "slug": "how-to-reach-sankri-from-dehradun",
        "title": "How to Reach Sankri from Dehradun for Kedarkantha and Har Ki Dun",
        "targetKeyword": "how to reach sankri from dehradun",
        "excerpt": "Sankri is the primary basecamp for Kedarkantha (₹3,500, 4 days) and Har Ki Dun (₹4,500, 5 days) in western Garhwal. Located 210 km from Dehradun, it takes 8–10 hours by shared taxi or private vehicle via Mussoorie, Nainbagh, and Mori along the Tons and Supin rivers.",
        "trekSlugs": [
            "kedarkantha-trek",
            "har-ki-dun-trek"
        ],
        "guideAuthor": "Kapil Rawat",
        "publishedDate": "2026-11-01",
        "updatedDate": "2026-11-01",
        "category": "Planning",
        "facts": [
            {
                "label": "Distance from Dehradun",
                "value": "210 km"
            },
            {
                "label": "Travel Time",
                "value": "8 – 10 Hours"
            },
            {
                "label": "Key Waypoints",
                "value": "Mussoorie, Damta, Purola, Mori, Netwar"
            },
            {
                "label": "Basecamp For",
                "value": "Kedarkantha, Har Ki Dun, Baraadsar"
            },
            {
                "label": "Lead Local Guide",
                "value": "Kapil Rawat & Kailash Rawat"
            }
        ],
        "sections": [
            {
                "heading": "Route Overview from Dehradun Railway Station",
                "body": "Sankri is situated inside Govind Pashu Vihar National Park in Uttarkashi district. Trekkers arriving by train at Dehradun should depart early around 6:00 AM to reach Sankri before nightfall.\n\nThe drive passes through Mussoorie, drops down to the Yamuna river valley at Nainbagh, ascends over pine ridges to Purola, and follows the Tons and Supin river gorges up into Sankri at 6,400 ft."
            },
            {
                "heading": "Transport Options & Practical Tips",
                "body": "Government buses and shared Sumo taxis depart outside Dehradun Railway Station between 5:30 AM and 7:00 AM. Private Bolero/Innova cabs can also be arranged.\n\nMobile connectivity drops significantly after Purola; BSNL works best in Sankri, with patchy Airtel/Jio signals. Withdraw cash in Dehradun or Purola as Sankri has no reliable ATMs."
            }
        ],
        "faqs": [
            {
                "question": "Can I get a direct bus from Dehradun to Sankri?",
                "answer": "Yes, early morning private and state transport buses leave between 5:30 AM and 7:00 AM from near Dehradun Railway Station."
            },
            {
                "question": "Which treks start from Sankri?",
                "answer": "Kedarkantha Trek (₹3,500), Har Ki Dun Trek (₹4,500), and Baraadsar Lake Trek (₹20,999) all organize departures from Sankri."
            }
        ]
    },
    {
        "slug": "kareri-lake-trek-in-summer",
        "title": "Kareri Lake Trek in May and June: Snow Melt, Campsites and Shepherd Trails",
        "targetKeyword": "kareri lake trek in summer",
        "excerpt": "May and June are prime months for the Kareri Lake Trek (₹1,500, 2 days). The glacial lake sits at 9,626 ft in the Dhauladhar range near Dharamshala. Snow melts reveal lush rhododendron forests and vibrant alpine pastures where local Gaddi shepherds graze their flocks.",
        "trekSlugs": [
            "kareri-lake-trek"
        ],
        "guideAuthor": "Aatish",
        "publishedDate": "2026-11-01",
        "updatedDate": "2026-11-01",
        "category": "Seasonal",
        "facts": [
            {
                "label": "Lake Elevation",
                "value": "9,626 ft"
            },
            {
                "label": "Starting Point",
                "value": "Kareri Village (6,200 ft)"
            },
            {
                "label": "Summer Temperatures",
                "value": "Day: 18°C–24°C, Night: 8°C–12°C"
            },
            {
                "label": "Trek Cost",
                "value": "₹1,500 per person"
            },
            {
                "label": "Local Guide",
                "value": "Aatish (7 Years experience)"
            }
        ],
        "sections": [
            {
                "heading": "Why May & June Offer the Cleanest Lake Reflections",
                "body": "In early summer, winter snow around the lake perimeter melts into pristine turquoise water that mirrors the craggy Dhauladhar summits above. Trail streams run clear and vibrant flowers bloom across Lioti meadow.\n\nDays are pleasantly warm, requiring only light trekking pants and shirts, while nights at the lakeshore are crisp without sub-zero winter extremes."
            },
            {
                "heading": "Meeting the Nomadic Gaddi Shepherds",
                "body": "Summer is the seasonal migration window for Gaddi pastoralists. As you trek with local guide Aatish, you will encounter traditional stone huts (goths) and shepherd flocks moving up into high alpine pastures, offering authentic cultural encounters."
            }
        ],
        "faqs": [
            {
                "question": "Is there snow at Kareri Lake in May?",
                "answer": "Patches of hard snow often linger on higher gullies around the lake in May, while the lakeshore and campsite are open and green."
            },
            {
                "question": "How cold does it get in June at camp?",
                "answer": "Night temperatures at 9,626 ft hover around 8°C to 12°C in June, requiring a fleece jacket and warm sleeping bag."
            }
        ]
    },
    {
        "slug": "baraadsar-lake-safety-difficulty",
        "title": "Baraadsar Lake Ridge Crossing Safety: What You Must Know Before Attempting",
        "targetKeyword": "baraadsar lake safety difficulty",
        "excerpt": "Baraadsar Lake Trek is a Hard, remote 7-day expedition costing ₹20,999 on the Himachal–Uttarakhand border, reaching 14,108 ft. The Daldhar ridge walk and high camp require serious preparation, porter support, water planning, and an experienced veteran guide like Kailash Rawat.",
        "trekSlugs": [
            "baraadsar-lake-trek"
        ],
        "guideAuthor": "Kailash Rawat",
        "publishedDate": "2026-11-01",
        "updatedDate": "2026-11-01",
        "category": "Guide",
        "facts": [
            {
                "label": "Difficulty Rating",
                "value": "Hard"
            },
            {
                "label": "Max Altitude",
                "value": "14,108 ft (~4,300 m)"
            },
            {
                "label": "Suggested Duration",
                "value": "7 Days"
            },
            {
                "label": "Expedition Cost",
                "value": "₹20,999 per person"
            },
            {
                "label": "Expedition Leader",
                "value": "Kailash Rawat (20 Years experience)"
            }
        ],
        "sections": [
            {
                "heading": "Why Baraadsar Is Classified as a Hard Expedition",
                "body": "Baraadsar Lake lies far away from tourist infrastructure between the Rupin and Supin valleys. Unlike commercialized trekking circuits, there are no permanent tea stalls, dhabas, or fixed shelters on the high ridge past Devbhasa.\n\nThe ridge walk over Daldhar is exposed to sudden windstorms and lightning. Trekkers must cross scree, loose moraine, and snowfields at 14,000+ ft where evacuation logistics are complex."
            },
            {
                "heading": "Crucial Water Management on Ridge Camps",
                "body": "Veteran guide Kailash Rawat emphasizes water discipline: water sources near Devbhasa and high camp are located deep in ravines hundreds of meters below the crest. The team must carry designated water supplies agreed upon before leaving Kasla and Rala villages."
            }
        ],
        "faqs": [
            {
                "question": "Can beginners join the Baraadsar Lake expedition?",
                "answer": "No. Trekkers must have prior experience with multi-day high-altitude treks above 12,000 ft (e.g., Har Ki Dun, Kedarkantha, or Sar Pass)."
            },
            {
                "question": "Why is the itinerary described as suggested?",
                "answer": "Because snow levels on the high ridge and weather across the border divide dictate daily campsite feasibility. The lead guide adjusts daily stages for group safety."
            }
        ]
    },
    {
        "slug": "kasol-to-grahan-trek",
        "title": "Kasol to Grahan Village Trek Route: First Day on the Sar Pass Trail",
        "targetKeyword": "kasol to grahan trek",
        "excerpt": "The trek from Kasol to Grahan Village is a 10 km forest walk rising from 5,100 ft to 7,700 ft along the Grahan Nal stream. Serving as Day 1 of the Sar Pass Trek (₹6,500), it introduces trekkers to dense pine forests and the preserved wooden architecture of traditional Himachali hamlets.",
        "trekSlugs": [
            "sar-pass-trek"
        ],
        "guideAuthor": "Pritam Negi",
        "publishedDate": "2026-11-01",
        "updatedDate": "2026-11-01",
        "category": "Guide",
        "facts": [
            {
                "label": "Distance",
                "value": "10 km"
            },
            {
                "label": "Elevation Gain",
                "value": "5,100 ft → 7,700 ft"
            },
            {
                "label": "Duration",
                "value": "4 – 5 Hours"
            },
            {
                "label": "Starting Point",
                "value": "Kasol Bridge"
            },
            {
                "label": "Trail Theme",
                "value": "Dense pine forest & rushing stream"
            }
        ],
        "sections": [
            {
                "heading": "Stepping off the Kasol Roads into Ancient Woods",
                "body": "The trek begins near the bridge over the Parvati River in Kasol. Almost immediately after leaving the main street, the trail enters dense Deodar and Rhododendron forest, tracking the left bank of Grahan Nal.\n\nThe gradient is mostly gradual with gentle stone paths, crossing wooden footbridges over crystal mountain streams before a final uphill pull into Grahan."
            },
            {
                "heading": "Inside Grahan Village: Architecture & Local Rules",
                "body": "Grahan is a traditional wooden hamlet where villagers adhere to ancient Kanashi customs. Wooden houses stand elevated on carved timber pillars. Visitors are requested to respect village guidelines regarding sacred shrines and clean trails."
            }
        ],
        "faqs": [
            {
                "question": "Can Kasol to Grahan be done as a standalone day hike?",
                "answer": "Yes, fit hikers can trek to Grahan in 4 hours, explore the village, and return to Kasol before evening, or stay overnight in a homestay."
            },
            {
                "question": "Is drinking water available along the trail?",
                "answer": "Yes, fresh mountain streams follow the path, though carrying a reusable bottle with a filtration straw or purification drops is advised."
            }
        ]
    },
    {
        "slug": "altitude-sickness-himalayan-treks-ams",
        "title": "High Altitude Sickness (AMS) Guide for Himalayan Treks Above 12,000 ft",
        "targetKeyword": "altitude sickness himalayan treks ams",
        "excerpt": "Acute Mountain Sickness (AMS) can affect trekkers ascending above 8,000–10,000 ft. High trails like Rupin Pass (15,250 ft), Hampta Pass (14,100 ft), and Sar Pass (13,800 ft) demand gradual pacing, hydration (3–4 liters daily), and strict adherence to guide advice on acclimatisation.",
        "trekSlugs": [
            "rupin-pass-trek",
            "hampta-pass",
            "sar-pass-trek"
        ],
        "guideAuthor": "Kapil Rawat",
        "publishedDate": "2026-11-01",
        "updatedDate": "2026-11-01",
        "category": "Planning",
        "facts": [
            {
                "label": "AMS Risk Threshold",
                "value": "8,000 ft (2,400 m) +"
            },
            {
                "label": "High Pass Elevations",
                "value": "Rupin (15,250 ft), Hampta (14,100 ft)"
            },
            {
                "label": "Daily Water Target",
                "value": "3 to 4 Liters"
            },
            {
                "label": "Key Golden Rule",
                "value": "Never ascend with symptoms"
            }
        ],
        "sections": [
            {
                "heading": "Recognizing Early Symptoms of AMS",
                "body": "As air pressure drops at higher altitudes, oxygen molecules become less dense. Mild AMS symptoms include persistent dull headaches, mild nausea, loss of appetite, dizziness, and restless sleep.\n\nKapil Rawat instructs all group members to voice headaches immediately rather than hiding symptoms. Mild AMS is easily managed with rest and hydration, but ignoring it can trigger severe pulmonary or cerebral complications."
            },
            {
                "heading": "The Three Golden Rules of Acclimatisation",
                "body": "1. Climb high, sleep low: Hike to higher vantage points during afternoon acclimatisation walks, then return to lower camps to sleep.\n2. Hydrate continually: Drink 3–4 liters of warm water and soup daily. Avoid alcohol, caffeine, and smoking.\n3. Descend if symptoms worsen: If a headache does not subside with hydration and rest, immediate descent to a lower campsite is the only definitive cure."
            }
        ],
        "faqs": [
            {
                "question": "Do local guides carry emergency oxygen cylinders?",
                "answer": "Yes, multi-day high pass expeditions (such as Hampta Pass and Rupin Pass) include emergency oxygen cylinders and first aid kits."
            },
            {
                "question": "Does fitness prevent altitude sickness?",
                "answer": "No. AMS depends on individual physiological acclimatisation speed, not physical gym fitness. Even marathon runners must pace their ascent slowly."
            }
        ]
    },
    {
        "slug": "har-ki-dun-osla-village-culture",
        "title": "Har Ki Dun Ancient Culture: Exploring Osla Village and the Supin Valley",
        "targetKeyword": "har ki dun osla village culture",
        "excerpt": "Osla is a centuries-old village along the Har Ki Dun trail (₹4,500, 5 days) in Govind Pashu Vihar National Park. Known for intricately carved multi-tiered wooden temples and traditional Garhwali stone homes, it offers an untouched glimpse into high Himalayan village life beneath Swargarohini.",
        "trekSlugs": [
            "har-ki-dun-trek"
        ],
        "guideAuthor": "Kapil Rawat",
        "publishedDate": "2026-11-01",
        "updatedDate": "2026-11-01",
        "category": "Guide",
        "facts": [
            {
                "label": "Trek Route",
                "value": "Har Ki Dun Trek (₹4,500)"
            },
            {
                "label": "Valley Elevation",
                "value": "11,700 ft"
            },
            {
                "label": "Village Elevation",
                "value": "8,500 ft"
            },
            {
                "label": "National Park",
                "value": "Govind Pashu Vihar, Uttarakhand"
            },
            {
                "label": "Dominant Peak",
                "value": "Swargarohini"
            }
        ],
        "sections": [
            {
                "heading": "The Architectural Marvel of Osla Village",
                "body": "Perched high on the mountain slope across the Supin River, Osla is famous for its intricate Kath-Kuni style timber-and-slate architecture designed to flex and survive seismic tremors.\n\nThe centerpiece of the village is a magnificent 2,000-year-old carved wooden temple adorned with animal horns and detailed relief carvings, embodying centuries of unique Garhwali mythology."
            },
            {
                "heading": "Weaving, Farming, and Ancient Traditions",
                "body": "Villagers in Osla wear hand-spun woollen coats called pattu and cultivate terraced fields of amaranth (chaulai) and rajma. The village remains free of motorized roads, preserving a pace of life deeply intertwined with the seasons and surrounding glaciated peaks."
            }
        ],
        "faqs": [
            {
                "question": "Do trekkers sleep inside Osla village on Har Ki Dun?",
                "answer": "Campsites are situated nearby at Pauni Garaat and Kalkatiyadhaar, allowing trekkers to visit Osla during Day 2 without disrupting village routines."
            },
            {
                "question": "What is the mythological importance of Har Ki Dun?",
                "answer": "Legend says the Pandava brothers and Draupadi walked through this cradle valley toward the towering Swargarohini peaks to ascend to heaven."
            }
        ]
    },
    {
        "slug": "dev-roopa-vs-hampta-pass",
        "title": "Dev Roopa vs Hampta Pass: Offbeat Parvati Meadows vs Spiti Crossover",
        "targetKeyword": "dev roopa vs hampta pass",
        "excerpt": "Dev Roopa (₹8,000, 5-6 days, 14,100 ft) is an untouched, serene meadow sanctuary in the Malana region of Parvati Valley. Hampta Pass (₹9,500, 5 days, 14,100 ft) is a dramatic high crossover from green Kullu to the cold desert of Lahaul. Both offer high adventure with contrasting terrain.",
        "trekSlugs": [
            "dev-roopa-trek",
            "hampta-pass"
        ],
        "guideAuthor": "Pritam Negi",
        "publishedDate": "2026-11-01",
        "updatedDate": "2026-11-01",
        "category": "Comparison",
        "facts": [
            {
                "label": "Dev Roopa Altitude",
                "value": "14,100 ft"
            },
            {
                "label": "Hampta Pass Altitude",
                "value": "14,100 ft"
            },
            {
                "label": "Dev Roopa Cost",
                "value": "₹8,000 per person"
            },
            {
                "label": "Hampta Pass Cost",
                "value": "₹9,500 per person"
            },
            {
                "label": "Dev Roopa Character",
                "value": "Remote meadow sanctuary"
            },
            {
                "label": "Hampta Pass Character",
                "value": "Valley-to-desert crossover"
            }
        ],
        "sections": [
            {
                "heading": "Solitude in Malana vs High Crossover Drama",
                "body": "While both treks reach an identical altitude of 14,100 ft in Himachal Pradesh, their core character is distinct.\n\nDev Roopa takes you into the remote Malana highlands where virtually no commercial tour groups operate. You camp beside serpentine glacial brooks meandering through immense green meadows.\n\nHampta Pass, on the other hand, is a grand topographical crossing where you hike up a lush green gorge from Manali, traverse icy passes, and descend into the Martian-like barren gravel plains of Lahaul."
            },
            {
                "heading": "Logistics and Experience Profile",
                "body": "Dev Roopa starts via Kasol and Waichin, making it ideal for backpackers seeking spiritual silence and undisturbed wilderness. Hampta Pass starts in Manali with full logistical support, river crossings, and vehicle access to Chandratal Lake."
            }
        ],
        "faqs": [
            {
                "question": "Which trek has fewer crowds?",
                "answer": "Dev Roopa has significantly fewer visitors — on many weeks, your group may be the only trekkers on the entire meadow."
            },
            {
                "question": "Which trek is better for photography?",
                "answer": "Both are extraordinary: Hampta Pass for dramatic geological contrast and Chandratal, Dev Roopa for winding streams and wide meadow expanses."
            }
        ]
    },
    {
        "slug": "tosh-village-trekking-guide",
        "title": "Tosh Village to Barshaini: The Local Guide's Guide to Lower Parvati Trails",
        "targetKeyword": "tosh village trekking guide",
        "excerpt": "Tosh is a cliffside village in Parvati Valley and the home base of veteran guide Pritam Negi. Perched at 7,874 ft, it serves as the launching pad for treks to Kheerganga (₹999), Buni Buni Pass (₹2,499), and Kutla meadows, offering apple orchards and river canyon panoramas.",
        "trekSlugs": [
            "kheerganga-trek",
            "buni-buni-pass"
        ],
        "guideAuthor": "Pritam Negi",
        "publishedDate": "2026-11-01",
        "updatedDate": "2026-11-01",
        "category": "Guide",
        "facts": [
            {
                "label": "Elevation",
                "value": "7,874 ft (2,400 m)"
            },
            {
                "label": "Distance from Barshaini",
                "value": "3 km (15 min drive / 45 min hike)"
            },
            {
                "label": "Connected Trails",
                "value": "Kheerganga, Buni Buni, Kutla, Sar Pass"
            },
            {
                "label": "Home Base Of",
                "value": "Guide Pritam Negi"
            }
        ],
        "sections": [
            {
                "heading": "The Gateway to Upper Parvati Wilderness",
                "body": "Perched on a ridge at the very end of the Parvati Valley roadhead, Tosh overlooks the confluence of the Tosh and Parvati rivers. Traditional wooden multi-storey homes and apple orchards cling to the steep mountainside against a backdrop of snow-capped peaks.\n\nLocal guide Pritam Negi was born and raised here, making Tosh an authentic staging ground for treks deeper into the valley."
            },
            {
                "heading": "Connecting Tosh with Nearby Trails",
                "body": "From Tosh, trekkers can hike down to Barshaini bridge in 45 minutes to commence the Kheerganga hot springs trail (₹999) or traverse across to Kalga to climb the quieter Buni Buni Pass (₹2,499).\n\nA shorter 3 km day trek leads up into Kutla meadow, filled with wildflowers, waterfalls, and peaceful camping clearings."
            }
        ],
        "faqs": [
            {
                "question": "How do you reach Tosh from Kasol?",
                "answer": "Take a local bus or taxi from Kasol to Barshaini (1 hour), then a shared cab up the 3 km road to Tosh village gate."
            },
            {
                "question": "Can you stay overnight in Tosh before starting a trek?",
                "answer": "Yes, Tosh has dozens of rustic local guesthouses and homestays overlooking the valley, ideal for acclimatising."
            }
        ]
    },
];

/** Helper: find an article by slug */
export function getArticleBySlug(slug: string): Article | undefined {
    return articles.find((a) => a.slug === slug);
}

