import type { Metadata } from 'next';
import SundiataPage from './SundiataPage';

export const metadata: Metadata = {
  title: "Who is Sundiata? | The Lion of Mali",
  description: "Discover the epic story of Sundiata Keita, the founder of the Mali Empire, and his journey from an exiled prince to a legendary king.",
  openGraph: {
    title: "Who is Sundiata? | The Lion of Mali",
    description: "Discover the epic story of Sundiata Keita, the founder of the Mali Empire, and his journey from an exiled prince to a legendary king.",
    images: [{ url: '/who-is-sundiata.png' }],
  },
};

export default function Page() {
  return <SundiataPage />;
}
