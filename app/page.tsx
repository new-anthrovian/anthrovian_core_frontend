import type { Metadata } from 'next';
import Hero from "@/components/Hero";
import ThreeSpirits from "@/components/ThreeSpirits";

export const metadata: Metadata = {
  title: "Anthrovian | Enter the World of African Mythology",
  description: "Experience the epic legends of Africa through an interactive digital platform. Every myth is a world you enter, a story you shape.",
};

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <ThreeSpirits />
      {/* Other sections will go here */}
    </div>
  );
}
