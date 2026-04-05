import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
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
    <section id="archives" className="py-32 bg-stone-100 overflow-hidden relative cursor-grab active:cursor-grabbing">
      <div className="max-w-7xl mx-auto px-6 mb-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h2 className="text-4xl md:text-5xl font-medium tracking-tight mb-4">The Archives</h2>
            <p className="text-stone-500 max-w-lg text-lg">Fling through our catalog. A physics-based draggable shelf powered by momentum.</p>
          </div>
          <div className="flex gap-2">
            <span className="px-4 py-2 rounded-full border border-stone-300 text-xs font-medium uppercase tracking-widest text-stone-500">Drag to explore</span>
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
