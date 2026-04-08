import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import SectionHeader from './ui/SectionHeader';
import authorImg from '../assets/author.avif';

const AuthorSpotlight: React.FC = () => {
  const containerRef = React.useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const yParallax = useTransform(scrollYProgress, [0, 1], [40, -40]);

  return (
    <section ref={containerRef} id="spotlight" className="py-32 lg:py-64 px-6 bg-white relative z-10 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <SectionHeader 
          eyebrow="Author Spotlight"
          title="Modern"
          subtitle="Silence."
          align="center"
          className="mb-32 lg:mb-48"
        />

        <div className="grid lg:grid-cols-12 gap-16 lg:gap-32 items-center">
          <div className="lg:col-span-6 relative">
             <div className="aspect-[4/5] w-full bg-stone-100 rounded-[3rem] overflow-hidden relative group shadow-2xl">
                <motion.img 
                  src={authorImg} 
                  alt="Elena Rostova"
                  style={{ y: yParallax }}
                  className="absolute inset-0 w-full h-full object-cover grayscale brightness-110 contrast-125 transition-transform duration-1000 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-stone-900/10 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-900/60 via-transparent to-transparent opacity-60" />
                
                <div className="absolute inset-0 flex flex-col justify-end p-12 z-10 translate-y-4 group-hover:translate-y-0 transition-transform duration-700">
                  <p className="text-white/80 font-light italic text-2xl lg:text-3xl mb-8 leading-tight">
                    &ldquo;The words bleed into the canvas of reality.&rdquo;
                  </p>
                  <div className="h-px w-16 bg-white/40 mb-6" />
                  <h3 className="text-4xl font-medium tracking-tighter text-white">Elena Rostova</h3>
                </div>
             </div>
             
             {/* Decorative Architectural Elements */}
             <div className="absolute -right-8 -bottom-8 w-32 h-32 border-r border-b border-stone-200 rounded-br-[3rem] hidden lg:block" />
             <div className="absolute -left-8 -top-8 w-32 h-32 border-l border-t border-stone-200 rounded-tl-[3rem] hidden lg:block" />
          </div>

          <div className="lg:col-span-6 flex flex-col items-start">
            <h4 className="text-[10px] tracking-[0.5em] uppercase font-bold text-stone-300 mb-12 flex items-center gap-4">
              <span className="w-12 h-px bg-stone-100" />
              The Profile
            </h4>
            <p className="text-2xl md:text-4xl text-stone-900 mb-12 leading-[1.15] font-light tracking-tight">
              A groundbreaking voice dissecting the intersection of <span className="italic text-stone-400">urban decay</span> and human isolation, beautifully bound in our exclusive collector&apos;s edition.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 w-full sm:w-auto">
               <button className="px-10 py-5 bg-stone-900 text-white rounded-full text-xs font-bold tracking-[0.3em] uppercase hover:bg-stone-800 transition-all hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] hover:-translate-y-1 duration-300">
                 Read Interview
               </button>
               <button className="px-10 py-5 bg-white border border-stone-200 text-stone-900 rounded-full text-xs font-bold tracking-[0.3em] uppercase hover:bg-stone-50 transition-all duration-300">
                 View Works
               </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthorSpotlight;
