import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import PostsSection from "@/components/PostsSection";
import CommunitySection from "@/components/CommunitySection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-gray-950 text-white overflow-hidden">
      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <PostsSection />
      <CommunitySection />
      <Footer />
    </main>
  );
}