'use client';

import Image from 'next/image';
import { motion, Variants } from 'framer-motion';

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function AboutPage() {
  return (
    <div className="bg-[#0D0806] min-h-screen overflow-hidden">

      {/* ── SECTION 1: HERO ───────────────────────────────────────────── */}
      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5 }}
        className="relative h-[70vh] min-h-[500px] flex flex-col items-center justify-center overflow-hidden"
      >
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/about-hero.png"
            alt="African musician by a campfire in the savanna"
            fill
            className="object-cover object-center"
            priority
          />
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-[#0D0806]" />
        </div>

        {/* Content */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="relative z-10 text-center px-6 flex flex-col items-center"
        >
          <h1 className="font-pt-serif font-bold tracking-wide">
            <span className="block text-[52px] md:text-[80px] leading-tight text-white uppercase">
              About
            </span>
            <span className="block text-[52px] md:text-[80px] leading-tight text-[#E8623A] uppercase">
              Anthrovian
            </span>
          </h1>
          <p className="font-inter text-[#F6DFB6]/80 text-[18px] md:text-[20px] mt-6 max-w-xl">
            Africa has always been a continent of stories.
          </p>
        </motion.div>
      </motion.section>

      {/* ── SECTION 2: INTRO TEXT ─────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="bg-[#0D0806] py-24 px-6"
      >
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <motion.p variants={fadeInUp} className="font-inter text-[#D4B896] text-[17px] md:text-[19px] leading-[1.9]">
            Not stories that sit quietly on pages. Stories that move. Told by
            firelight. Passed from mouth to ear. Carried across generations in
            the voices of griots who believed that memory lives in sound, not
            ink.
          </motion.p>
          <motion.p variants={fadeInUp} className="font-inter text-[#D4B896] text-[17px] md:text-[19px] leading-[1.9]">
            Those stories never stopped being extraordinary. The world just
            stopped listening.
          </motion.p>
          <motion.p variants={fadeInUp} className="font-pt-serif font-bold text-[#E8623A] text-[20px] md:text-[22px] italic">
            Anthrovian exists to change that.
          </motion.p>
        </div>
      </motion.section>

      {/* ── SECTION 3: WHAT WE ARE ────────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="bg-[#0D0806] py-20 px-6"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Text */}
          <motion.div variants={fadeInUp} className="order-2 md:order-1">
            <p className="font-inter text-[#E8623A]/70 text-[11px] tracking-[3px] uppercase mb-4">
              The Experience
            </p>
            <h2 className="font-pt-serif font-bold text-[#F6DFB6] text-[40px] md:text-[52px] leading-tight mb-6">
              What we are
            </h2>
            <p className="font-inter text-[#D4B896]/80 text-[16px] leading-relaxed mb-4">
              An interactive African mythology platform. Every myth is a world
              you enter, a story you shape, a mirror that shows you who you are.
            </p>
            <div className="flex items-center gap-3 mt-6">
              <span className="w-2 h-2 rounded-full bg-[#E8623A] flex-shrink-0" />
              <p className="font-inter text-[#E8623A] text-[14px] italic">
                Not a museum. Not a textbook. A living experience.
              </p>
            </div>
          </motion.div>
          {/* Image */}
          <motion.div variants={fadeInUp} className="order-1 md:order-2 relative rounded-2xl overflow-hidden aspect-[4/3]">
            <Image
              src="/what-we-are.jpg"
              alt="Hands holding a phone displaying African mythology interactive world"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-[#0D0806]/20 to-transparent" />
          </motion.div>
        </div>
      </motion.section>

      {/* ── SECTION 4: HOW WE BUILD ───────────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="bg-[#0D0806] py-20 px-6"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Image */}
          <motion.div variants={fadeInUp} className="relative rounded-2xl overflow-hidden aspect-[4/3]">
            <Image
              src="/create.jpg"
              alt="African griot hands with traditional instruments"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0D0806]/20 to-transparent" />
          </motion.div>
          {/* Text */}
          <motion.div variants={fadeInUp}>
            <p className="font-inter text-[#E8623A]/70 text-[11px] tracking-[3px] uppercase mb-4">
              The Process
            </p>
            <h2 className="font-pt-serif font-bold text-[#F6DFB6] text-[40px] md:text-[52px] leading-tight mb-6">
              How we build
            </h2>
            <p className="font-inter text-[#D4B896]/80 text-[16px] leading-relaxed mb-4">
              Every mythworld is co-created with African storytellers, historians,
              and cultural custodians. AI serves the story. It never replaces the
              humans who carry it.
            </p>
            <p className="font-inter text-[#D4B896]/60 text-[15px] leading-relaxed">
              We call this the Living Canon.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* ── SECTION 5: WHO WE BUILD FOR ───────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="bg-[#0D0806] py-20 px-6"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Text */}
          <motion.div variants={fadeInUp} className="order-2 md:order-1">
            <p className="font-inter text-[#E8623A]/70 text-[11px] tracking-[3px] uppercase mb-4">
              The Audience
            </p>
            <h2 className="font-pt-serif font-bold text-[#F6DFB6] text-[40px] md:text-[52px] leading-tight mb-6">
              Who we build for
            </h2>
            <div className="space-y-5 font-inter text-[#D4B896]/80 text-[15px] leading-[1.85]">
              <p>
                For 400 million African youth who have never seen their mythology
                rendered as a living, interactive world.
              </p>
              <p>
                For the African American mother who sat across from us and said
                she has been trying to tell her children one thing their whole
                lives — that they come from the lions of giants. That before the
                ships, before the chains, before everything that was taken, there
                were empires. There were philosopher queens and lion kings and
                cities that made medieval Europe look small. She has been trying
                to say this with words. Now there is a world she can hand them.
              </p>
              <p>
                For every Black family across the Americas, the Caribbean,
                Europe, and beyond who carries a heritage that history tried to
                erase and has never had a digital space that carries it back.
              </p>
              <p>
                For every human being of any background who has grown up on
                Greek gods, Norse warriors, and Japanese folklore and never knew
                that Africa&apos;s mythological universe is just as vast, just as
                ancient, and in many ways the deepest root of the human story
                itself.
              </p>
            </div>
          </motion.div>
          {/* Image */}
          <motion.div variants={fadeInUp} className="order-1 md:order-2 relative rounded-2xl overflow-hidden aspect-[4/3]">
            <Image
              src="/audience.png"
              alt="African mother and daughter sharing a smartphone"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-[#0D0806]/20 to-transparent" />
          </motion.div>
        </div>
      </motion.section>

      {/* ── SECTION 6: HUMAN PLATFORM STATEMENT ──────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="bg-[#0D0806] py-24 px-6 border-t border-[#F6DFB6]/5"
      >
        <div className="max-w-3xl mx-auto text-center">
          {/* Globe icon */}
          <div className="w-12 h-12 mx-auto mb-8 opacity-40">
            <svg viewBox="0 0 24 24" fill="none" stroke="#E8623A" strokeWidth="1" className="w-full h-full">
              <circle cx="12" cy="12" r="10" />
              <path d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
            </svg>
          </div>
          <h2 className="font-pt-serif font-bold text-[#E8623A] text-[28px] md:text-[38px] leading-tight mb-6">
            Anthrovian is not an African platform. It is a human one.
          </h2>
          <p className="font-inter text-[#D4B896]/60 text-[16px] md:text-[18px]">
            It begins in Africa because that is where humanity begins.
          </p>
        </div>
      </motion.section>

      {/* ── SECTION 7: A CONTINENT OF CREATORS ───────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="bg-[#0D0806] py-20 px-6"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Image */}
          <motion.div variants={fadeInUp} className="relative rounded-2xl overflow-hidden aspect-[4/3]">
            <Image
              src="/vision.png"
              alt="African creative writer at a laptop"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#0D0806]/20 to-transparent" />
          </motion.div>
          {/* Text */}
          <motion.div variants={fadeInUp}>
            <p className="font-inter text-[#E8623A]/70 text-[11px] tracking-[3px] uppercase mb-4">
              The Vision
            </p>
            <h2 className="font-pt-serif font-bold text-[#F6DFB6] text-[40px] md:text-[52px] leading-tight mb-6">
              A continent of creators
            </h2>
            <div className="space-y-4 font-inter text-[#D4B896]/80 text-[15px] leading-[1.85]">
              <p>
                Anthrovian is not a content studio. It is a platform. The Living
                Canon Studio opens the tools of mythmaking to any African creative
                who has a story worth telling.
              </p>
              <p>
                Writers publish their own interactive myth episodes. Musicians
                score new mythworlds. Voice actors bring legends to life in their
                own languages and accents. Visual artists define how their culture
                looks on screen.
              </p>
              <p>
                Every creator owns what they build. Every myth earns royalties.
                Every contribution expands a canon that belongs to the continent,
                not a corporation.
              </p>
            </div>
            {/* Quote bar */}
            <div className="mt-8 border-l-2 border-[#E8623A]/60 pl-5">
              <p className="font-inter text-[#E8623A] text-[14px] italic leading-relaxed">
                This is the part that matters most. Not what we build for Africa.
                What Africa builds through us.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* ── SECTION 8: WHERE WE ARE GOING ────────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={staggerContainer}
        className="bg-[#0D0806] py-20 px-6"
      >
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Text */}
          <motion.div variants={fadeInUp} className="order-2 md:order-1">
            <p className="font-inter text-[#E8623A]/70 text-[11px] tracking-[3px] uppercase mb-4">
              The Future
            </p>
            <h2 className="font-pt-serif font-bold text-[#F6DFB6] text-[40px] md:text-[52px] leading-tight mb-6">
              Where we are going
            </h2>
            <div className="space-y-4 font-inter text-[#D4B896]/80 text-[15px] leading-[1.85]">
              <p>
                Anthrovian launches with one lion. One epic. Ɛ ùsan Amira is
                coming. The Orishas are coming. Mami Wata, Anansi, the spirit
                legends of a hundred cultures and a thousand storytellers who
                have never had a stage this large.
              </p>
              <p>
                Educational licensing for schools and institutions. IP expansion
                into animation, games, and film. A creator marketplace where
                African mythology becomes one of the defining cultural exports of
                this generation.
              </p>
            </div>
          </motion.div>
          {/* Image */}
          <motion.div variants={fadeInUp} className="order-1 md:order-2 relative rounded-2xl overflow-hidden aspect-[4/3]">
            <Image
              src="/the-future.jpg"
              alt="African mythological warrior in vivid digital art"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-[#0D0806]/20 to-transparent" />
          </motion.div>
        </div>
      </motion.section>

      {/* ── SECTION 9: THE MANDEN STATEMENT ──────────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="bg-[#0D0806] py-24 px-6 border-t border-[#F6DFB6]/5"
      >
        <div className="max-w-2xl mx-auto text-center space-y-4">
          <p className="font-inter text-[#D4B896]/40 text-[13px] tracking-[2px] uppercase">
            The world has had Marvel. It has had Studio Ghibli. It has had
            Hollywood.
          </p>
          <p className="font-pt-serif font-bold text-[#F6DFB6] text-[28px] md:text-[36px] leading-tight">
            Now it gets the Manden.
          </p>
        </div>
      </motion.section>

      {/* ── SECTION 10: THE BELIEF AT THE CENTER ─────────────────────── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeInUp}
        className="bg-[#0D0806] py-24 px-6 border-t border-[#F6DFB6]/5"
      >
        <div className="max-w-2xl mx-auto text-center">
          <p className="font-inter text-[#E8623A] text-[11px] tracking-[3px] uppercase mb-8">
            The Belief at the Center of Everything
          </p>
          <p className="font-inter text-[#D4B896]/70 text-[17px] md:text-[19px] leading-relaxed mb-8">
            African folklore has waited long enough to be more than a footnote
            in someone else&apos;s mythology.
          </p>
          {/* Divider */}
          <div className="w-12 h-px bg-[#F6DFB6]/20 mx-auto mb-10" />
          <h2 className="font-pt-serif font-bold text-[#F6DFB6] text-[32px] md:text-[44px] leading-tight mb-10">
            These are living worlds. They deserve living form.
          </h2>
          <p className="font-inter text-[#E8623A] text-[16px] italic">
            The ancestors answer through the phone in your hand.
          </p>
        </div>
      </motion.section>

    </div>
  );
}
