import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

const HeroSection: React.FC = () => {
  const { scrollY } = useScroll();
  // Parallax offsets for the hero cards
  const y1 = useTransform(scrollY, [0, 1000], [0, -100]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);
  const y3 = useTransform(scrollY, [0, 1000], [0, -350]);

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const staggerItem = {
    hidden: { opacity: 0, y: 40 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] as any } }
  };

  return (
    <section id="hero" className="relative pt-32 pb-20 md:pt-48 md:pb-32 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
        <div className="relative z-10 flex flex-col items-start">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-stone-200 bg-white text-xs font-medium tracking-wide uppercase mb-6"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            Spring Collection Live
          </motion.div>
          <motion.h1 
            variants={staggerContainer}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.1 }}
            className="text-7xl md:text-8xl lg:text-9xl font-medium tracking-tighter leading-[0.9] mb-12"
          >
            <motion.span variants={staggerItem} className="block">Read</motion.span>
            <motion.span variants={staggerItem} className="block text-stone-400">deeper.</motion.span>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-lg md:text-xl text-stone-500 max-w-md mb-10 leading-relaxed"
          >
            A meticulously curated selection of literature, art, and philosophy for the modern intellectual.
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex items-center gap-4"
          >
            <button className="px-8 py-4 bg-stone-900 text-white rounded-full font-medium hover:bg-stone-800 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex items-center gap-2">
              Explore Library <ArrowRight size={18} />
            </button>
            <button className="px-8 py-4 bg-white border border-stone-200 text-stone-900 rounded-full font-medium hover:bg-stone-50 transition-all duration-300">
              Our Story
            </button>
          </motion.div>
        </div>

        {/* Hero Visual - Abstract Composition representing books */}
        <div className="relative h-[500px] w-full hidden lg:block perspective-1000">
           <motion.div 
              style={{ y: y1 }}
              className="absolute right-10 top-10 w-64 h-96 bg-stone-200 rounded-r-2xl rounded-l-sm shadow-2xl rotate-y-12 rotate-z-6 transform-style-3d hover:rotate-y-0 hover:rotate-z-0 transition-transform duration-700 ease-out z-10 flex items-center justify-center border-l-4 border-white"
           >
              <span className="writing-vertical-rl text-stone-400 font-serif text-2xl tracking-widest" style={{ writingMode: 'vertical-rl' }}>DESIGN</span>
           </motion.div>
           <motion.div 
              style={{ y: y2 }}
              className="absolute right-40 top-32 w-72 h-[420px] bg-stone-900 rounded-r-2xl rounded-l-sm shadow-2xl -rotate-y-12 -rotate-z-3 transform-style-3d hover:rotate-y-0 hover:rotate-z-0 transition-transform duration-700 ease-out z-20 flex flex-col justify-between p-8 border-l-4 border-stone-700"
           >
              <div className="text-stone-400 text-sm tracking-widest uppercase">Featured</div>
              <div className="text-white text-4xl font-medium tracking-tight">The Modern<br/>Aesthetic</div>
           </motion.div>
           <motion.div 
              style={{ y: y3 }}
              className="absolute right-0 bottom-0 w-48 h-64 bg-orange-100 rounded-r-xl rounded-l-sm shadow-xl rotate-y-12 rotate-z-12 z-0"
           ></motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
