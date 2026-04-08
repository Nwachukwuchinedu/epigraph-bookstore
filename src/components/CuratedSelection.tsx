import React from 'react';
import { ChevronRight } from 'lucide-react';
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

interface CuratedSelectionProps {
  books: Book[];
  onAddToCart: (title: string) => void;
}

const CuratedSelection: React.FC<CuratedSelectionProps> = ({ books, onAddToCart }) => {
  return (
    <section id="curated" className="py-32 lg:py-56 px-6 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-32 gap-12">
          <SectionHeader 
            eyebrow="Curated Selection"
            title="Essential"
            subtitle="Volumes."
            align="left"
            className="mb-0 lg:mb-0"
          />
          <button className="text-xs font-bold tracking-[0.3em] uppercase border-b border-stone-900 pb-2 hover:text-stone-500 hover:border-stone-500 transition-all flex items-center gap-2 self-start md:mb-4">
            View All Books <ChevronRight size={14} />
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
    </section>
  );
};

export default CuratedSelection;
