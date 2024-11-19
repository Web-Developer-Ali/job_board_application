"use client";

import Link from 'next/link';
import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-400 border-t border-gray-200 dark:border-gray-800">
      <div className="container mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Job<span className="text-red-500 dark:text-red-400">Portal</span>
            </h2>
            <p className="text-sm">Your gateway to finding the perfect job.</p>
          </div>

          <nav className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="hover:text-gray-900 dark:hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="/careers" className="hover:text-gray-900 dark:hover:text-white transition-colors">Careers</Link></li>
              <li><Link href="/press" className="hover:text-gray-900 dark:hover:text-white transition-colors">Press</Link></li>
            </ul>
          </nav>

          <nav className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Resources</h3>
            <ul className="space-y-2">
              <li><Link href="/blog" className="hover:text-gray-900 dark:hover:text-white transition-colors">Blog</Link></li>
              <li><Link href="/help-center" className="hover:text-gray-900 dark:hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="/privacy" className="hover:text-gray-900 dark:hover:text-white transition-colors">Privacy</Link></li>
              <li><Link href="/terms" className="hover:text-gray-900 dark:hover:text-white transition-colors">Terms</Link></li>
            </ul>
          </nav>

          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white uppercase tracking-wider">Stay Connected</h3>
            <div className="flex space-x-4">
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <Facebook className="h-6 w-6" />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <Twitter className="h-6 w-6" />
              </a>
              <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <Linkedin className="h-6 w-6" />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                <Instagram className="h-6 w-6" />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <p className="text-center text-sm">
            © {currentYear} JobPortal. All rights reserved. Designed & Developed by JobPortal Team.
          </p>
        </div>
      </div>
    </footer>
  );
}