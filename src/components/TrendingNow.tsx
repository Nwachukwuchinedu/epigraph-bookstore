import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import InteractiveBookCard from './ui/InteractiveBookCard';

interface Book {
  id: number;
  title: string;
  author: string;
  price: string;
  color: string;
  textColor: string;
  tag: string | null;
  synopsis: string;
}

interface TrendingNowProps {
  books: Book[];
  onAddToCart: (title: string) => void;
}

const TrendingNow: React.FC<TrendingNowProps> = ({ books, onAddToCart }) => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as any } }
  };

  return (
    <motion.section 
      id="trending"
      variants={sectionVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, margin: "-100px" }}
      className="py-32 bg-stone-950 text-white overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
        <div>
          <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">Trending Now</h2>
          <p className="text-stone-400 max-w-lg text-lg">Swipe through our most coveted editions of the season. Limited stock available.</p>
        </div>
        <button className="text-sm font-medium border-b border-white pb-1 hover:text-stone-300 hover:border-stone-300 transition-colors flex items-center gap-1 self-start md:self-auto">
          Explore Collection <ArrowRight size={16} />
        </button>
      </div>

      <div className="flex overflow-x-auto gap-8 px-6 md:px-12 pb-12 snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {books.map((book) => (
          <div key={book.id} className="min-w-[280px] md:min-w-[320px] snap-center group cursor-pointer flex-shrink-0">
            <InteractiveBookCard book={book} theme="dark" onAddToCart={onAddToCart} />
            <div className="flex justify-between items-start gap-4">
              <div>
                <h4 className="font-medium text-lg leading-tight mb-1 text-white group-hover:text-stone-300 transition-colors">{book.title}</h4>
                <p className="text-sm text-stone-400">{book.author}</p>
              </div>
              <span className="font-medium bg-stone-800 px-2 py-1 rounded text-sm text-stone-200">{book.price}</span>
            </div>
          </div>
        ))}
        {/* Empty element for padding at the end of scroll */}
        <div className="min-w-[24px] flex-shrink-0"></div>
      </div>
    </motion.section>
  );
};

export default TrendingNow;
