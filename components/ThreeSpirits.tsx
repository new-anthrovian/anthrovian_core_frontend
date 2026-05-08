'use client';

import { motion, Variants } from 'framer-motion';

const spirits = [
  {
    title: 'Fadenya',
    description: 'The spirit of ambition, rivalry, and forging your own name.',
    icon: (
      <svg className="w-8 h-8 text-[#F46C39]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.99 7.99 0 0120 13a7.98 7.98 0 01-2.343 5.657z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.879 16.121A3 3 0 1012.015 11L11 14l.879 2.121z" />
      </svg>
    ),
    glow: 'from-[#F46C39]/20',
    borderColor: 'border-[#F46C39]/30',
  },
  {
    title: 'Badenya',
    description: 'The spirit of family, unity, and deep-rooted harmony.',
    icon: (
      <svg className="w-8 h-8 text-[#F6DFB6]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    ),
    glow: 'from-[#F6DFB6]/10',
    borderColor: 'border-[#F6DFB6]/20',
  },
  {
    title: 'Nyama',
    description: 'The hidden life force and magical energy that binds all.',
    icon: (
      <svg className="w-8 h-8 text-[#60A5FA]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    glow: 'from-[#60A5FA]/20',
    borderColor: 'border-[#60A5FA]/30',
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 30, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const ThreeSpirits = () => {
  return (
    <section className="bg-[#1A110F] py-24 px-6 overflow-hidden">
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={containerVariants}
        className="max-w-7xl mx-auto"
      >
        <div className="text-center mb-16">
          <motion.h2 variants={itemVariants} className="font-pt-serif text-[40px] md:text-[54px] leading-tight text-[#F6DFB6] mb-6">
            The Three Spirits
          </motion.h2>
          <motion.p variants={itemVariants} className="font-inter text-[#F6DFB6]/80 text-[16px] md:text-[18px] max-w-2xl mx-auto leading-relaxed">
            Before you begin, reflect on what drives you. The paths you favor will shape the outcome of the tale.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {spirits.map((spirit, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className={`relative group bg-[#2A1A17]/80 backdrop-blur-md rounded-[32px] p-10 border ${spirit.borderColor} transition-all duration-500 hover:transform hover:-translate-y-2 overflow-hidden`}
            >
              {/* Glow Effect */}
              <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${spirit.glow} to-transparent blur-3xl opacity-50 group-hover:opacity-100 transition-opacity`} />
              
              <div className="relative z-10 flex flex-col items-center text-center">
                {/* Icon Container */}
                <div className={`w-20 h-20 rounded-full border ${spirit.borderColor} flex items-center justify-center mb-8 bg-[#2A1A17]/50 backdrop-blur-sm shadow-inner`}>
                  {spirit.icon}
                </div>

                {/* Title */}
                <h3 className="font-pt-serif text-[28px] text-[#F6DFB6] mb-4">
                  {spirit.title}
                </h3>

                {/* Description */}
                <p className="font-inter text-[#F6DFB6]/60 text-[15px] leading-relaxed">
                  {spirit.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </section>
  );
};

export default ThreeSpirits;
