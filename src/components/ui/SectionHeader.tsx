import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

interface SectionHeaderProps {
  eyebrow: string;
  title: string;
  subtitle: string;
  id?: string;
  className?: string;
  align?: 'left' | 'center';
  theme?: 'light' | 'dark';
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ 
  eyebrow, 
  title, 
  subtitle, 
  id, 
  className = "", 
  align = 'center',
  theme = 'light'
}) => {
  const isLeft = align === 'left';
  const isDark = theme === 'dark';
  
  return (
    <div id={id} className={`relative flex flex-col ${isLeft ? 'items-start text-left' : 'items-center text-center'} mb-24 lg:mb-40 ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className={`flex items-center gap-3 ${isDark ? 'text-stone-700' : 'text-stone-300'} mb-8`}
      >
        <Sparkles size={16} />
        <span className="text-[10px] tracking-[0.5em] uppercase font-bold">{eyebrow}</span>
      </motion.div>
      
      <h2 className={`relative flex flex-col ${isLeft ? 'items-start' : 'items-center'}`}>
        <motion.span 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className={`text-7xl md:text-8xl lg:text-[12rem] font-medium tracking-[-0.05em] leading-[0.8] ${isDark ? 'text-white' : 'text-stone-900'}`}
        >
          {title}
        </motion.span>
        <motion.span 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className={`text-3xl md:text-4xl lg:text-7xl font-light italic ${isDark ? 'text-stone-600' : 'text-stone-400'} tracking-tight mt-4`}
        >
          {subtitle}
        </motion.span>
      </h2>
    </div>
  );
};

export default SectionHeader;
