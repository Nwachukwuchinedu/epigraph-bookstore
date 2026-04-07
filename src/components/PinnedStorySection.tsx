import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const PinnedStorySection: React.FC = () => {
  const targetRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start start", "end end"] });
  
  const opacity1 = useTransform(scrollYProgress, [0, 0.3, 0.35], [1, 1, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.35], [0, -40]);
  
  const opacity2 = useTransform(scrollYProgress, [0.3, 0.35, 0.65, 0.7], [0, 1, 1, 0]);
  const y2 = useTransform(scrollYProgress, [0.3, 0.35, 0.65, 0.7], [40, 0, 0, -40]);
  
  const opacity3 = useTransform(scrollYProgress, [0.65, 0.7, 1], [0, 1, 1]);
  const y3 = useTransform(scrollYProgress, [0.65, 0.7], [40, 0]);

  return (
    <section id="story" ref={targetRef} className="h-[200vh] bg-stone-950 text-white relative">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
         {/* Subtle background glow */}
         <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(40,40,40,1)_0%,rgba(12,12,12,1)_100%)] opacity-50"></div>
         
         {/* Background graphic */}
         <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <motion.div style={{ rotate: useTransform(scrollYProgress, [0,1], [0, 180]) }} className="w-[800px] h-[800px] border-[1px] border-stone-500 rounded-full border-dashed"></motion.div>
         </div>

         <motion.div style={{ opacity: opacity1, y: y1 }} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <p className="text-stone-500 tracking-[0.4em] uppercase text-[10px] mb-8 font-bold">Phase I</p>
            <h2 className="text-6xl md:text-9xl font-medium mb-12 tracking-tighter text-stone-100">The Selection.</h2>
            <p className="text-2xl md:text-4xl text-stone-300 max-w-5xl leading-tight font-light transition-all">We scour global archives, private collections, and independent presses to find works that challenge the status quo.</p>
         </motion.div>

         <motion.div style={{ opacity: opacity2, y: y2 }} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <p className="text-stone-500 tracking-[0.4em] uppercase text-[10px] mb-8 font-bold">Phase II</p>
            <h2 className="text-6xl md:text-9xl font-medium mb-12 tracking-tighter text-stone-100">The Restoration.</h2>
            <p className="text-2xl md:text-4xl text-stone-300 max-w-5xl leading-tight font-light transition-all">Vintage editions undergo meticulous restoration by master binders, preserving their history while securing their future.</p>
         </motion.div>

         <motion.div style={{ opacity: opacity3, y: y3 }} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <p className="text-stone-500 tracking-[0.4em] uppercase text-[10px] mb-8 font-bold">Phase III</p>
            <h2 className="text-6xl md:text-9xl font-medium mb-12 tracking-tighter text-stone-100">The Experience.</h2>
            <p className="text-2xl md:text-4xl text-stone-300 max-w-5xl leading-tight font-light transition-all">From our shelves to your hands. Delivered in bespoke archival packaging designed to turn unboxing into a ritual.</p>
         </motion.div>
      </div>
    </section>
  );
};

export default PinnedStorySection;
