import FeaturedJobs from "@/components/FeaturedJobs";
import Footer from "@/components/Footer";
import HeroSection from "@/components/HeroSection";
import JobCategories from "@/components/JobCategories";

export default function Home() {
  return (
    <div>
    {/* Hero Section */}
    <HeroSection />

    {/* Job Categories */}
    <JobCategories />

    {/* Featured Jobs */}
    <FeaturedJobs />

    {/* Footer */}
    <Footer />
  </div>
  );
}
