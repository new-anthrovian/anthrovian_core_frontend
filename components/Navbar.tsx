'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-[linear-gradient(180deg,rgba(54,32,27,0.9)_0%,rgba(54,32,27,0)_100%)]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex justify-between items-center h-24">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center">
              <Image 
                src="/logo/anthrovian-logo.svg" 
                alt="Anthrovian Logo" 
                width={180} 
                height={48} 
                className="h-10 w-auto"
                priority
              />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-12">
            <Link 
              href="/about" 
              className="text-[#F6DFB6] font-inter font-medium text-[14px] leading-[20px] tracking-normal align-middle px-6 py-2 rounded-full border border-[#F6DFB6]/20 hover:bg-[#F6DFB6]/10 transition-all"
            >
              About Anthrovian
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#F6DFB6] hover:text-white focus:outline-none transition-colors"
              aria-expanded={isOpen}
            >
              <span className="sr-only">Open main menu</span>
              {/* Hamburger Icon */}
              {!isOpen ? (
                <svg
                  className="block h-8 w-8"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg
                  className="block h-8 w-8"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div 
        className={`md:hidden fixed inset-0 z-40 bg-[#36201B]/95 backdrop-blur-md transition-all duration-300 transform ${
          isOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        }`}
      >
        <div className="flex flex-col h-full pt-24 px-6">
          <Link 
            href="/about" 
            className="text-[#F6DFB6] font-inter font-medium text-[18px] leading-[24px] px-6 py-3 rounded-full border border-[#F6DFB6]/20 hover:bg-[#F6DFB6]/10 transition-all text-center"
            onClick={() => setIsOpen(false)}
          >
            About Anthrovian
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
