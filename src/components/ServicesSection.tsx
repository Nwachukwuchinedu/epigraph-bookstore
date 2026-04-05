import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Star, ShoppingBag } from 'lucide-react';

const ServicesSection: React.FC = () => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  return (
    <motion.section 
      id="services"
      variants={sectionVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, margin: "-100px" }}
      className="py-1 relative overflow-hidden bg-[#F5F5F4]"
    >
       <div className="max-w-7xl mx-auto py-32 px-6">
          <div className="grid md:grid-cols-3 gap-12 md:gap-0 md:divide-x divide-stone-300/60">
             <div className="md:pr-12 flex flex-col items-start group">
                <div className="p-5 bg-white rounded-2xl shadow-sm border border-stone-100 mb-8 group-hover:-translate-y-2 group-hover:shadow-md transition-all duration-300">
                   <BookOpen size={28} strokeWidth={1.5} className="text-stone-900" />
                </div>
                <h3 className="text-2xl font-medium tracking-tight mb-4">Rare Editions</h3>
                <p className="text-stone-500 leading-relaxed text-lg">Access first prints, signed copies, and meticulously bound limited releases from global publishers.</p>
             </div>
             
             <div className="md:px-12 flex flex-col items-start group">
                <div className="p-5 bg-white rounded-2xl shadow-sm border border-stone-100 mb-8 group-hover:-translate-y-2 group-hover:shadow-md transition-all duration-300">
                   <Star size={28} strokeWidth={1.5} className="text-stone-900" />
                </div>
                <h3 className="text-2xl font-medium tracking-tight mb-4">Curated Monthly</h3>
                <p className="text-stone-500 leading-relaxed text-lg">A hand-selected volume delivered to your door every month, tailored exactly to your intellectual palate.</p>
             </div>

             <div className="md:pl-12 flex flex-col items-start group">
                <div className="p-5 bg-white rounded-2xl shadow-sm border border-stone-100 mb-8 group-hover:-translate-y-2 group-hover:shadow-md transition-all duration-300">
                   <ShoppingBag size={28} strokeWidth={1.5} className="text-stone-900" />
                </div>
                <h3 className="text-2xl font-medium tracking-tight mb-4">White Glove Delivery</h3>
                <p className="text-stone-500 leading-relaxed text-lg">Every piece is handled with archival care, ensuring it arrives in pristine, gallery-ready condition.</p>
             </div>
          </div>
       </div>
    </motion.section>
  );
};

export default ServicesSection;
