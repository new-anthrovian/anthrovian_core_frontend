import Hero from "@/components/Hero";
import ThreeSpirits from "@/components/ThreeSpirits";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <ThreeSpirits />
      {/* Other sections will go here */}
    </div>
  );
}
