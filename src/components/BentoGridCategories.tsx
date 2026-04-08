import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, Sparkles } from 'lucide-react';

interface Category {
  name: string;
  count: string;
  span: string;
  bg: string;
  tag?: string;
  desc?: string;
}

interface BentoGridCategoriesProps {
  categories: Category[];
}

const CategoryCard = ({ cat, idx }: { cat: Category, idx: number }) => {
  const isDark = cat.bg.includes('bg-stone-900');
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
      className={`${cat.span} ${cat.bg} rounded-[2.5rem] p-10 flex flex-col justify-between group cursor-pointer relative overflow-hidden border border-black/5 hover:shadow-[0_40px_80px_rgba(0,0,0,0.06)] transition-all duration-700`}
    >
      {/* Abstract Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_30%_30%,currentColor_0%,transparent_50%)]" />
      </div>
      
      <div className="relative z-10 flex justify-between items-start">
        <div className="flex flex-col gap-3">
          <span className={`text-[10px] tracking-[0.4em] uppercase font-bold ${isDark ? 'text-white/40' : 'text-stone-400'}`}>
            {cat.tag || 'Discipline'}
          </span>
          <h3 className={`text-4xl lg:text-5xl font-medium tracking-tighter leading-[0.9] ${isDark ? 'text-white' : 'text-stone-900'}`}>
            {cat.name}
          </h3>
        </div>
        <motion.div 
          whileHover={{ rotate: 45, scale: 1.1 }}
          className={`p-4 rounded-xl backdrop-blur-md border ${isDark ? 'bg-white/10 border-white/10 text-white' : 'bg-white border-stone-100 text-stone-900'} shadow-sm transition-all duration-500`}
        >
          <ArrowUpRight size={24} strokeWidth={1.5} />
        </motion.div>
      </div>

      <div className="relative z-10 mt-12">
        <p className={`text-lg mb-6 max-w-[200px] leading-tight font-light ${isDark ? 'text-white/60' : 'text-stone-500'}`}>
          {cat.desc}
        </p>
        <div className="flex items-center gap-3">
          <span className={`h-px w-8 ${isDark ? 'bg-white/10' : 'bg-stone-200'}`} />
          <p className={`text-[10px] uppercase tracking-widest font-bold ${isDark ? 'text-white/40' : 'text-stone-400'}`}>
            {cat.count}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

const BentoGridCategories: React.FC<BentoGridCategoriesProps> = ({ categories }) => {
  return (
    <section id="explore" className="py-32 lg:py-48 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        {/* Monumental Header */}
        <div className="relative flex flex-col items-center mb-32 lg:mb-48 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 text-stone-300 mb-8"
          >
            <Sparkles size={16} />
            <span className="text-xs tracking-[0.5em] uppercase font-bold">The Catalog</span>
          </motion.div>
          
          <h2 className="relative flex flex-col items-center">
            <motion.span 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="text-8xl lg:text-[14rem] font-medium tracking-[-0.05em] leading-[0.7] text-stone-900"
            >
              Explore
            </motion.span>
            <motion.span 
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl lg:text-7xl font-light italic text-stone-400 tracking-tight mt-4"
            >
              by Discipline
            </motion.span>
          </h2>
        </div>
        
        {/* Architectural Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 auto-rows-[350px]">
          {categories.map((cat, idx) => (
            <CategoryCard key={idx} cat={cat} idx={idx} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default BentoGridCategories;
