import HomePage from '../src/components/templates/HomePage';
import { NextSeo } from 'next-seo';

interface HomeProps { }

export default function Home({ }: HomeProps) {
  return (
    <>
      <NextSeo 
        title="Uncharted Travel | Epic Himalayan Treks & Expeditions"
        description="Discover the most breathtaking Himalayan treks, offbeat trails, and expert local guides with Uncharted Travel. Book your next adventure today."
        canonical="https://unchartedtravel.in/"
      />
      <HomePage />
    </>
  );
}
