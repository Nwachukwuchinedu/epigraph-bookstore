import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

interface Category {
  name: string;
  count: string;
  span: string;
  bg: string;
}

interface BentoGridCategoriesProps {
  categories: Category[];
}

const BentoGridCategories: React.FC<BentoGridCategoriesProps> = ({ categories }) => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <motion.section 
      id="explore"
      variants={sectionVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, margin: "-100px" }}
      className="py-24 px-6"
    >
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-16 text-center">Explore by Discipline</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[250px]">
          {categories.map((cat, idx) => (
            <div key={idx} className={`${cat.span} ${cat.bg} rounded-3xl p-8 md:p-10 flex flex-col justify-between group cursor-pointer hover:shadow-lg transition-all duration-300 relative overflow-hidden border border-black/5`}>
              <div className="z-10 flex justify-between items-start">
                <h3 className={`text-2xl md:text-3xl font-medium tracking-tight ${cat.bg.includes('text-white') ? 'text-white' : 'text-stone-900'}`}>
                  {cat.name}
                </h3>
                <div className={`p-3 rounded-full bg-white/20 backdrop-blur-sm group-hover:scale-110 transition-transform ${cat.bg.includes('text-white') ? 'text-white' : 'text-stone-900'}`}>
                  <ArrowRight size={20} strokeWidth={1.5} />
                </div>
              </div>
              <p className={`z-10 text-sm font-medium uppercase tracking-widest ${cat.bg.includes('text-white') ? 'text-white/60' : 'text-stone-500'}`}>
                {cat.count}
              </p>
              {/* Decorative circle on hover */}
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-current opacity-[0.03] rounded-full group-hover:scale-150 transition-transform duration-700 ease-out"></div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default BentoGridCategories;
