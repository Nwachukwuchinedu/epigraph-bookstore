import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const PinnedStorySection: React.FC = () => {
  const targetRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: targetRef, offset: ["start start", "end end"] });
  
  const opacity1 = useTransform(scrollYProgress, [0, 0.2, 0.3], [1, 1, 0]);
  const y1 = useTransform(scrollYProgress, [0, 0.3], [0, -100]);
  
  const opacity2 = useTransform(scrollYProgress, [0.2, 0.4, 0.6, 0.7], [0, 1, 1, 0]);
  const y2 = useTransform(scrollYProgress, [0.2, 0.4, 0.6, 0.7], [100, 0, 0, -100]);
  
  const opacity3 = useTransform(scrollYProgress, [0.6, 0.8, 1], [0, 1, 1]);
  const y3 = useTransform(scrollYProgress, [0.6, 0.8], [100, 0]);

  return (
    <section id="story" ref={targetRef} className="h-[300vh] bg-stone-950 text-white relative">
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
         {/* Background graphic */}
         <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
            <motion.div style={{ rotate: useTransform(scrollYProgress, [0,1], [0, 180]) }} className="w-[800px] h-[800px] border-[1px] border-stone-500 rounded-full border-dashed"></motion.div>
         </div>

         <motion.div style={{ opacity: opacity1, y: y1 }} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <p className="text-stone-400 tracking-widest uppercase text-sm mb-6 font-medium">Phase I</p>
            <h2 className="text-5xl md:text-7xl font-medium mb-6">The Selection.</h2>
            <p className="text-xl text-stone-400 max-w-2xl">We scour global archives, private collections, and independent presses to find works that challenge the status quo.</p>
         </motion.div>

         <motion.div style={{ opacity: opacity2, y: y2 }} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <p className="text-stone-400 tracking-widest uppercase text-sm mb-6 font-medium">Phase II</p>
            <h2 className="text-5xl md:text-7xl font-medium mb-6">The Restoration.</h2>
            <p className="text-xl text-stone-400 max-w-2xl">Vintage editions undergo meticulous restoration by master binders, preserving their history while securing their future.</p>
         </motion.div>

         <motion.div style={{ opacity: opacity3, y: y3 }} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
            <p className="text-stone-400 tracking-widest uppercase text-sm mb-6 font-medium">Phase III</p>
            <h2 className="text-5xl md:text-7xl font-medium mb-6">The Experience.</h2>
            <p className="text-xl text-stone-400 max-w-2xl">From our shelves to your hands. Delivered in bespoke archival packaging designed to turn unboxing into a ritual.</p>
         </motion.div>
      </div>
    </section>
  );
};

export default PinnedStorySection;
