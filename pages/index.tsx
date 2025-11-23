import HomePage from '../src/components/templates/HomePage';

interface HomeProps {
  onJoinWaitlist: () => void;
}

export default function Home({ onJoinWaitlist }: HomeProps) {
  return <HomePage onJoinWaitlist={onJoinWaitlist} />;
}
