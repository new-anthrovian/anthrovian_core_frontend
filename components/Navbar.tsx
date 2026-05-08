'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const navLinks = [
  { label: 'About Anthrovian', href: '/about' },
];

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  return (
    <>
      {/* ── MAIN NAV BAR ───────────────────────────────────────────── */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[linear-gradient(180deg,rgba(54,32,27,0.9)_0%,rgba(54,32,27,0)_100%)]">
        <div className="max-w-7xl mx-auto px-5 lg:px-12">
          <div className="flex justify-between items-center h-20 md:h-24">

            {/* Logo — smaller on mobile */}
            <div className="flex-shrink-0 flex items-center">
              <Link href="/" className="flex items-center" onClick={() => setIsOpen(false)}>
                <Image
                  src="/logo/anthrovian-logo.svg"
                  alt="Anthrovian Logo"
                  width={180}
                  height={48}
                  className="h-7 w-auto md:h-10"
                  priority
                />
              </Link>
            </div>

            {/* Desktop links */}
            <div className="hidden md:flex items-center space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-[#F6DFB6] font-inter font-medium text-[14px] leading-[20px] px-6 py-2 rounded-full border border-[#F6DFB6]/20 hover:bg-[#F6DFB6]/10 transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Hamburger button — mobile only */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsOpen(true)}
              className="md:hidden flex items-center justify-center p-2 rounded-md text-[#F6DFB6] hover:text-white focus:outline-none transition-colors"
              aria-label="Open navigation menu"
            >
              <svg className="h-7 w-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </nav>

      {/* ── MOBILE DRAWER OVERLAY ──────────────────────────────────── */}
      {/* Backdrop */}
      <div
        onClick={() => setIsOpen(false)}
        className={`md:hidden fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm transition-opacity duration-300 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <div
        className={`md:hidden fixed top-0 right-0 bottom-0 z-[70] w-[80vw] max-w-[320px] bg-[#1E0F0C] flex flex-col shadow-2xl transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
      >
        {/* Drawer header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-[#F6DFB6]/10">
          <Link href="/" onClick={() => setIsOpen(false)}>
            <Image
              src="/logo/anthrovian-logo.svg"
              alt="Anthrovian Logo"
              width={130}
              height={36}
              className="h-6 w-auto"
            />
          </Link>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 rounded-md text-[#F6DFB6] hover:text-white focus:outline-none transition-colors"
            aria-label="Close navigation menu"
          >
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Drawer nav links */}
        <nav className="flex flex-col gap-3 px-6 pt-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="text-[#F6DFB6] font-inter font-medium text-[16px] px-5 py-3 rounded-full border border-[#F6DFB6]/20 hover:bg-[#F6DFB6]/10 transition-all text-center"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </>
  );
};

export default Navbar;
