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
        // TODO (owner): supply public/assets/og-cover.jpg — 1200x630, Himalaya + brand cover.
        // The file does NOT exist yet; this config path is ready when you add the image.
        url: 'https://unchartedtravel.in/assets/og-cover.jpg',
        width: 1200,
        height: 630,
        alt: 'Uncharted Travel — Himalayan Treks & Expeditions',
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
