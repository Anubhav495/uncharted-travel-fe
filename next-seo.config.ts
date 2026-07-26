const config = {
  defaultTitle: 'Uncharted Travel | Epic Himalayan Treks & Expeditions',
  titleTemplate: '%s | Uncharted Travel',
  description: 'Discover the most breathtaking Himalayan treks, offbeat trails, and expert local guides with Uncharted Travel. Book your next adventure today.',
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    url: 'https://unchartedtravel.in/',
    siteName: 'Uncharted Travel',
    images: [
      {
        url: 'https://unchartedtravel.in/assets/dev-roopa/WhatsApp Image 2026-06-28 at 10.05.47 (1).jpeg', // Use a beautiful default image
        width: 1200,
        height: 630,
        alt: 'Uncharted Travel - Himalayan Adventures',
      },
    ],
  },
  twitter: {
    handle: '@unchartedtravel',
    site: '@unchartedtravel',
    cardType: 'summary_large_image',
  },
};

export default config;
