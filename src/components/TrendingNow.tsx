import SectionHeader from './ui/SectionHeader';
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
  return (
    <section id="trending" className="py-32 lg:py-64 bg-stone-950 text-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row md:items-end justify-between mb-24 gap-12">
        <SectionHeader 
          eyebrow="Trending Collections"
          title="Most"
          subtitle="Coveted."
          align="left"
          theme="dark"
          className="mb-0 lg:mb-0"
        />
        <button className="text-xs font-bold tracking-[0.3em] uppercase border-b border-white pb-2 hover:text-stone-300 hover:border-stone-300 transition-all flex items-center gap-2 self-start md:mb-4">
          Explore Collection <ArrowRight size={14} />
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
    </section>
  );
};

export default TrendingNow;
