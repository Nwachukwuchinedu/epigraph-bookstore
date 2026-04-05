import React from 'react';
import { motion } from 'framer-motion';

const AuthorSpotlight: React.FC = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as any } }
  };

  return (
    <motion.section 
      id="spotlight"
      variants={sectionVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, margin: "-100px" }}
      className="py-32 px-6 bg-white relative"
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-16 items-center">
        <div className="lg:col-span-5 relative">
           <div className="aspect-[3/4] w-full bg-stone-100 rounded-3xl overflow-hidden relative group shadow-sm">
              <div className="absolute inset-0 bg-gradient-to-t from-stone-300 to-stone-50 mix-blend-multiply"></div>
              <div className="absolute -left-20 -top-20 w-96 h-96 bg-stone-200 rounded-full blur-3xl opacity-60 group-hover:scale-110 transition-transform duration-1000"></div>
              <div className="absolute right-0 bottom-0 w-64 h-64 bg-stone-300 rounded-full blur-2xl opacity-50 group-hover:scale-125 transition-transform duration-1000"></div>
              
              <div className="absolute inset-0 flex flex-col justify-end p-10 z-10">
                <p className="text-stone-600 font-serif italic text-2xl md:text-3xl mb-6">"The words bleed into the canvas of reality."</p>
                <div className="h-px w-12 bg-stone-900 mb-4"></div>
                <h3 className="text-3xl font-medium tracking-tight text-stone-900">E. Rostova</h3>
              </div>
           </div>
        </div>
        <div className="lg:col-span-7 flex flex-col items-start">
          <div className="text-stone-500 text-sm tracking-widest uppercase mb-6 flex items-center gap-3 font-semibold">
            <span className="w-8 h-px bg-stone-300"></span>
            Author Spotlight
          </div>
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-medium tracking-tighter mb-8 leading-[1.05]">
            Architect of<br/>Modern Silence.
          </h2>
          <p className="text-lg md:text-xl text-stone-500 mb-10 leading-relaxed max-w-2xl">
            Dive into the mind of Elena Rostova, this month's featured literary voice. Her groundbreaking work dissects the intersection of urban decay and human isolation, beautifully bound in our exclusive collector's edition.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
             <button className="px-8 py-4 bg-stone-900 text-white rounded-full font-medium hover:bg-stone-800 transition-all hover:shadow-xl hover:-translate-y-1 duration-300">
               Read Interview
             </button>
             <button className="px-8 py-4 bg-white border border-stone-200 text-stone-900 rounded-full font-medium hover:bg-stone-50 transition-colors">
               View Her Works
             </button>
          </div>
        </div>
      </div>
    </motion.section>
  );
};

export default AuthorSpotlight;
