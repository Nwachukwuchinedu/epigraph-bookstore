import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import InteractiveBookCard from './ui/InteractiveBookCard';
import SectionHeader from './ui/SectionHeader';

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

interface DraggableShelfProps {
  books: Book[];
  onAddToCart: (title: string) => void;
}

const DraggableShelf: React.FC<DraggableShelfProps> = ({ books, onAddToCart }) => {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [dragWidth, setDragWidth] = useState(0);

  useEffect(() => {
    const calcWidth = () => {
      if (carouselRef.current) {
        setDragWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
      }
    };
    calcWidth();
    window.addEventListener('resize', calcWidth);
    // Timeout to ensure content is fully painted before width calculation
    const timeout = setTimeout(calcWidth, 500);
    return () => {
      window.removeEventListener('resize', calcWidth);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <section id="shelf" className="py-32 lg:py-64 bg-stone-100 overflow-hidden relative cursor-grab active:cursor-grabbing">
      <div className="max-w-7xl mx-auto px-6 mb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-12">
          <SectionHeader 
            eyebrow="Momentum Shelf"
            title="The"
            subtitle="Archives."
            align="left"
            className="mb-0 lg:mb-0"
          />
          <div className="flex gap-2 self-start md:mb-4">
            <span className="px-6 py-3 rounded-full border border-stone-300 text-[10px] font-bold uppercase tracking-[0.3em] text-stone-500 bg-white/50 backdrop-blur-sm">Drag to explore</span>
          </div>
        </div>
      </div>
      
      <motion.div ref={carouselRef} className="px-6 md:px-12">
        <motion.div 
          drag="x"
          dragConstraints={{ right: 0, left: -dragWidth }}
          dragElastic={0.1}
          className="flex gap-10 w-max"
        >
          {books.map((book) => (
            <div key={`drag-${book.id}`} className="min-w-[280px] md:min-w-[320px] flex-shrink-0">
              <InteractiveBookCard book={book} theme="light" onAddToCart={onAddToCart} />
              <div className="flex justify-between items-start gap-4 mt-2">
                <div>
                  <h4 className="font-medium text-lg leading-tight mb-1 text-stone-900">{book.title}</h4>
                  <p className="text-sm text-stone-500">{book.author}</p>
                </div>
              </div>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default DraggableShelf;
