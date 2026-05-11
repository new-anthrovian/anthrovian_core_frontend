import type { Metadata } from 'next';
import AboutPage from './AboutPage';

export const metadata: Metadata = {
  title: "About Anthrovian | Our Mission & Vision",
  description: "Learn about Anthrovian's mission to preserve and celebrate African mythology through interactive digital storytelling.",
  openGraph: {
    title: "About Anthrovian | Our Mission & Vision",
    description: "Learn about Anthrovian's mission to preserve and celebrate African mythology through interactive digital storytelling.",
    images: [{ url: '/about-hero.png' }],
  },
};

export default function Page() {
  return <AboutPage />;
}
