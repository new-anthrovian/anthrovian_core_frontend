'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Hero = () => {
  const router = useRouter();
  return (
    <section className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0 z-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
        >
          <source src="/anthrovian-hero.mp4" type="video/mp4" />
        </video>
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Content */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="relative z-10 max-w-7xl mx-auto px-6 text-center flex flex-col items-center"
      >
        {/* Eyebrow */}
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 0.9 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="font-pt-serif italic font-normal text-[20px] leading-[28px] text-[#F6DFB6] mb-4 opacity-90"
        >
          Your destiny is waiting
        </motion.p>

        {/* Title */}
        <motion.h1 
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="font-pt-serif font-bold text-[48px] md:text-[90px] leading-[56px] md:leading-[100px] tracking-[-1px] md:tracking-[-2.5px] text-[#F46C39] mb-8 max-w-4xl"
        >
          The Epic of Sundiata
        </motion.h1>

        {/* Subtext */}
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.9, duration: 0.8 }}
          className="font-pt-serif italic font-normal text-[20px] md:text-[30px] leading-[24px] md:leading-[28px] text-[#F6DFB6] mb-12 max-w-3xl"
        >
          "The lion does not tell the hunter he is a lion."
        </motion.p>

        {/* CTA Button */}
        <motion.button
          type="button"
          onClick={() => router.push('/awaken')}
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 1.1, duration: 0.5 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-[#F6DFB6] text-[#36201B] font-inter font-semibold text-[16px] px-10 py-4 rounded-full hover:bg-white transition-all shadow-xl mb-6"
        >
          Awaken the lion
        </motion.button>

        {/* Secondary Link */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3, duration: 0.8 }}
        >
          <Link 
            href="/sundiata" 
            className="text-[#F6DFB6]/80 font-inter text-[14px] hover:text-[#F6DFB6] transition-colors border-b border-[#F6DFB6]/20 pb-1"
          >
            Who is Sundiata
          </Link>
        </motion.div>
      </motion.div>

      {/* Bottom Gradient Fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 to-transparent z-1" />
    </section>
  );
};

export default Hero;
