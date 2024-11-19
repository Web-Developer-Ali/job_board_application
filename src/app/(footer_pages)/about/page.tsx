import { Metadata } from 'next';
import Image from 'next/image';

export const metadata: Metadata = {
  title: 'About Us | JobPortal',
  description: 'Learn about JobPortal&apos;s mission, team, and values.',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold text-center mb-8">About JobPortal</h1>
      
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
        <p className="text-lg mb-4">
          At JobPortal, we&apos;re on a mission to connect talented individuals with their dream careers. We believe that the right job can transform lives, and we&apos;re dedicated to making that transformation as smooth and accessible as possible.
        </p>
        <Image 
          src="/placeholder.svg?height=400&width=600" 
          alt="Team working together" 
          width={600} 
          height={400} 
          className="rounded-lg shadow-md"
        />
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-4">Our Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {['CEO', 'CTO', 'Head of HR'].map((role, index) => (
            <div key={index} className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-2">{role}</h3>
              <Image 
                src={`/placeholder.svg?height=100&width=100&text=${role}`} 
                alt={role} 
                width={100} 
                height={100} 
                className="rounded-full mx-auto mb-4"
              />
              <p className="text-center">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold mb-4">Our Values</h2>
        <ul className="list-disc list-inside space-y-2">
          <li>Innovation: We constantly strive to improve our platform and services.</li>
          <li>Integrity: We believe in honest and transparent practices in all our dealings.</li>
          <li>Inclusivity: We celebrate diversity and promote equal opportunities for all.</li>
          <li>Impact: We measure our success by the positive change we bring to people&apos;s careers.</li>
        </ul>
      </section>
    </div>
  );
}
