import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen } from 'lucide-react';

const QuoteSection: React.FC = () => {
  const quoteText = "A room without books is like a body without a soul.";
  
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const quoteVariants = {
    hidden: { opacity: 1 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.04 }
    }
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.section 
      id="quote"
      variants={sectionVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, margin: "-100px" }}
      className="py-32 px-6 bg-stone-900 text-white text-center"
    >
      <div className="max-w-4xl mx-auto flex flex-col items-center">
        <BookOpen className="mb-8 text-stone-500 opacity-50" size={48} strokeWidth={1} />
        <motion.h2 
          variants={quoteVariants}
          className="text-4xl md:text-5xl lg:text-6xl font-medium tracking-tight leading-tight mb-10 flex flex-wrap justify-center gap-x-3 gap-y-2"
        >
          {quoteText.split(" ").map((word, i) => (
            <span key={i} className="inline-flex overflow-hidden">
              {word.split("").map((char, j) => (
                <motion.span key={j} variants={letterVariants}>{char}</motion.span>
              ))}
            </span>
          ))}
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 2, duration: 1 }}
          className="text-stone-400 uppercase tracking-widest text-sm"
        >
          — Marcus Tullius Cicero
        </motion.p>
      </div>
    </motion.section>
  );
};

export default QuoteSection;
