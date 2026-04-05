import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
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

interface CuratedSelectionProps {
  books: Book[];
  onAddToCart: (title: string) => void;
}

const CuratedSelection: React.FC<CuratedSelectionProps> = ({ books, onAddToCart }) => {
  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as any } }
  };

  return (
    <motion.section 
      id="curated"
      variants={sectionVariants}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, margin: "-100px" }}
      className="py-24 px-6 bg-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-medium tracking-tight mb-3">Curated Selection</h2>
            <p className="text-stone-500 max-w-lg">Hand-picked volumes that challenge perspectives and inspire creativity.</p>
          </div>
          <button className="text-sm font-medium border-b border-stone-900 pb-1 hover:text-stone-500 hover:border-stone-500 transition-colors flex items-center gap-1 self-start md:self-auto">
            View All Books <ChevronRight size={16} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16">
          {books.slice(0, 4).map((book) => (
            <div key={book.id} className="group cursor-pointer">
              <InteractiveBookCard book={book} theme="light" onAddToCart={onAddToCart} />
              <div className="flex justify-between items-start gap-4">
                <div>
                  <h4 className="font-medium text-lg leading-tight mb-1 group-hover:text-orange-600 transition-colors">{book.title}</h4>
                  <p className="text-sm text-stone-500">{book.author}</p>
                </div>
                <span className="font-medium bg-stone-50 px-2 py-1 rounded text-sm">{book.price}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.section>
  );
};

export default CuratedSelection;
