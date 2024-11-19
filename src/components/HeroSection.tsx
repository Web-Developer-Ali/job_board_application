"use client";
import SearchForm from './Borwse_jobs/SerchForm';
import { useRouter } from 'next/navigation';

const HeroSection: React.FC = () => {
  const router = useRouter();

  const handleSearch = (query:string) => {
   router.replace(`/browse_jobs?searchQuery=${query}`)
  };

  return (
    <section className="py-20 px-4 sm:px-6 text-center bg-white dark:bg-gray-900">
      {/* Small text at the top of the banner */}
      <p className="m-1 text-sm text-red-500 dark:text-red-400 bg-gray-100 dark:bg-gray-800 inline-block px-4 mb-2 border border-red-500 dark:border-red-400 rounded-full py-1">
        No.1 Hunt Website
      </p>
      
      <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
        Search, Apply &<br />
        <span className="text-purple-500 dark:text-purple-400"> Get Your Dream Jobs</span>
      </h1>
      <p className="mt-4 text-lg text-gray-700 dark:text-gray-300">Search jobs, internships, and freelance gigs</p>

      <div className="mt-8 ">
       <SearchForm onSearch={handleSearch}/>
      </div>
    </section>
  );
};

export default HeroSection;
