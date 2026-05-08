import Image from 'next/image';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Who is Sundiata? | Anthrovian',
  description:
    'The Epic of Sundiata — born unable to walk, exiled, and destined to found the Mali Empire. Now it is your turn to shape the legend.',
};

export default function SundiataPage() {
  return (
    <div className="bg-[#120A07] min-h-screen">

      {/* ── SECTION 1: HERO ───────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/who-is-sundiata.png"
            alt="Sundiata Keita — the Lion of Mali"
            fill
            className="object-cover object-center"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#120A07]" />
        </div>

        {/* Content */}
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto flex flex-col items-center">
          <h1 className="font-pt-serif font-bold leading-none tracking-tight">
            <span className="block text-[56px] md:text-[90px] text-white uppercase">
              Who is
            </span>
            <span className="block text-[56px] md:text-[90px] text-[#E8623A] uppercase">
              Sundiata?
            </span>
          </h1>

          {/* Vertical divider */}
          <div className="w-px h-16 bg-[#F6DFB6]/30 my-10" />

          {/* Intro copy */}
          <div className="space-y-5 font-inter text-[#D4B896]/80 text-[16px] md:text-[18px] leading-[1.85] text-center">
            <p>
              Around 1217, in the heart of the Manden, a child was born who
              could not walk. His name was Maghan Sundiata Keita. A hunter had
              prophesied his birth years before it happened.
            </p>
            <p>
              His mother, Sogolon, arrived carrying a power no one in the court
              understood. And for the first seven years of his life, Sundiata
              sat in the dust while the world laughed.
            </p>
          </div>
        </div>
      </section>

      {/* ── SECTION 2: STORY CHAPTERS ─────────────────────────────────── */}
      <section className="bg-[#120A07] py-4">

        {/* Chapter 1 — The iron rod (image left, text right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-b border-[#F6DFB6]/5">
          {/* Image */}
          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[380px]">
            <Image
              src="/iron-rod.png"
              alt="Blacksmith forging an iron rod"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#120A07]/30" />
          </div>
          {/* Text */}
          <div className="bg-[#1A0E0A] flex flex-col justify-center px-10 py-14 md:py-16">
            <h2 className="font-pt-serif font-bold text-[#E8623A] text-[32px] md:text-[40px] leading-tight mb-6">
              The iron rod
            </h2>
            <div className="space-y-4 font-inter text-[#D4B896]/75 text-[15px] leading-[1.85]">
              <p>
                His mother wept one night because she had to beg for baobab
                leaves from a servant. Sundiata heard it.
              </p>
              <p>
                The next morning he asked the blacksmiths for the heaviest iron
                rod they had. He gripped it. He stood. The iron bent like a bow.
                The ground shook.
              </p>
              <p>
                He walked to the great baobab at the center of the compound,
                tore it from the earth, and carried the whole tree to his
                mother&apos;s door. So she would never have to ask anyone for
                anything again.
              </p>
            </div>
          </div>
        </div>

        {/* Chapter 2 — The exile (text left, image right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-b border-[#F6DFB6]/5">
          {/* Text card */}
          <div className="bg-[#1A0E0A]/90 flex flex-col justify-center px-10 py-14 md:py-16">
            <h2 className="font-pt-serif font-bold text-[#F6DFB6] text-[32px] md:text-[40px] leading-tight mb-6">
              The exile
            </h2>
            <p className="font-inter text-[#D4B896]/75 text-[15px] leading-[1.85]">
              Driven from Niani, the family wandered for years through kingdoms
              that received them with caution and eventually reverence. Sundiata
              trained. He grew. He became a man armies followed.
            </p>
          </div>
          {/* Image */}
          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[380px]">
            <Image
              src="/the-exile.png"
              alt="A lone figure walking toward the sunset in exile"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#120A07]/30" />
          </div>
        </div>

        {/* Chapter 3 — The sorcerer of Sosso (image left, text right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 border-b border-[#F6DFB6]/5">
          {/* Image */}
          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[380px]">
            <Image
              src="/the-sorcerer.png"
              alt="The Battle of Kirina — armies marching through storms"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#120A07]/30" />
          </div>
          {/* Text */}
          <div className="bg-[#1A0E0A] flex flex-col justify-center px-10 py-14 md:py-16">
            <h2 className="font-pt-serif font-bold text-[#E8623A] text-[32px] md:text-[40px] leading-tight mb-6">
              The sorcerer of Sosso
            </h2>
            <div className="space-y-4 font-inter text-[#D4B896]/75 text-[15px] leading-[1.85]">
              <p>
                Soumaoro Kanté had taken Niani, burned the Manden, and scattered
                its people. No weapon could touch him.
              </p>
              <p>
                Until Sundiata&apos;s sister, held captive for years, escaped
                carrying a secret she had spent years learning. At the Battle of
                Krina, Sundiata used it. Soumaoro fled into the mountain and was
                never seen again.
              </p>
            </div>
          </div>
        </div>

        {/* Chapter 4 — The empire he built (text left, image right) */}
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Text card */}
          <div className="bg-[#1A0E0A]/90 flex flex-col justify-center px-10 py-14 md:py-16">
            <h2 className="font-pt-serif font-bold text-[#F6DFB6] text-[32px] md:text-[40px] leading-tight mb-6">
              The empire he built
            </h2>
            <div className="space-y-4 font-inter text-[#D4B896]/75 text-[15px] leading-[1.85]">
              <p>
                After victory, Sundiata gathered the twelve kings and wrote the
                Manden Charter. Rights for ordinary people. Protection for the
                voiceless. Scholars call it one of the earliest human rights
                declarations in recorded history.
              </p>
              <p className="text-[#E8623A] text-[14px] italic">
                The Mali Empire he founded became one of the wealthiest in the
                medieval world.
              </p>
            </div>
          </div>
          {/* Image */}
          <div className="relative aspect-[4/3] md:aspect-auto md:min-h-[380px]">
            <Image
              src="/the-empire-built.png"
              alt="Sundiata on his throne surrounded by kings"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#120A07]/30" />
          </div>
        </div>
      </section>

      {/* ── SECTION 3: WHY HIS STORY STILL MATTERS ───────────────────── */}
      <section className="bg-[#120A07] py-24 px-6">
        <div className="max-w-2xl mx-auto text-center">
          {/* Flame icon */}
          <div className="mb-6 flex justify-center">
            <svg className="w-8 h-8 text-[#E8623A]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.99 7.99 0 0120 13a7.98 7.98 0 01-2.343 5.657z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 16.121A3 3 0 1012.015 11L11 14l.879 2.121z" />
            </svg>
          </div>

          <h2 className="font-pt-serif font-bold text-[#F6DFB6] text-[32px] md:text-[44px] leading-tight mb-10">
            Why his story still matters
          </h2>

          {/* Card */}
          <div className="bg-[#1A0E0A]/70 border border-[#F6DFB6]/10 rounded-2xl px-8 py-10 md:px-12 md:py-12 text-left space-y-6">
            <p className="font-inter text-[#D4B896]/75 text-[15px] md:text-[16px] leading-[1.85] text-center">
              The Epic of Sundiata is not about a man who was always strong.
            </p>
            <p className="font-inter text-[#D4B896]/75 text-[15px] md:text-[16px] leading-[1.85] text-center">
              It is about a child who sat in dust for seven years while the
              world decided what to do with him. It is about the question every
              person eventually faces.
            </p>

            {/* Pull quote */}
            <div className="border-l-2 border-[#E8623A] pl-6 py-2 my-6">
              <p className="font-pt-serif font-bold text-[#E8623A] text-[20px] md:text-[24px] leading-tight italic">
                &ldquo;When the iron is placed before you, how do you rise?&rdquo;
              </p>
            </div>

            <p className="font-inter text-[#D4B896]/75 text-[15px] md:text-[16px] leading-[1.85] text-center">
              The griots have been singing his name for eight centuries. Now it
              is your turn. Your choices shape the legend.
            </p>

            {/* CTA */}
            <div className="flex justify-center pt-4">
              <Link
                href="/"
                className="font-inter font-medium text-[#F6DFB6] text-[15px] px-8 py-3 rounded-full border border-[#F6DFB6]/40 hover:bg-[#F6DFB6]/10 transition-all"
              >
                Awaken the lion
              </Link>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
