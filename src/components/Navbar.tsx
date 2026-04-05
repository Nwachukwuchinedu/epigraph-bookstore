import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, ShoppingBag, Menu } from 'lucide-react';

interface NavbarProps {
  setRoute: (route: string) => void;
  currentRoute: string;
}

const Navbar: React.FC<NavbarProps> = ({ setRoute, currentRoute }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md border-b border-gray-100 py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-6 lg:gap-12">
          <motion.div 
            onClick={() => setRoute('home')}
            className="text-2xl font-bold tracking-tighter cursor-pointer"
            whileHover={{ scale: 1.02 }}
          >
            EPIGRAPH.
          </motion.div>
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium text-stone-500">
            {['Shop', 'Collections', 'Journal', 'About'].map((item) => (
              <button 
                key={item} 
                onClick={() => setRoute(item.toLowerCase())}
                className={`hover:text-stone-900 transition-colors uppercase tracking-widest text-[10px] lg:text-xs ${currentRoute === item.toLowerCase() ? 'text-stone-900' : ''}`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-4 lg:gap-6">
          <button className="p-2 hover:bg-stone-100 rounded-full transition-colors">
            <Search size={20} strokeWidth={1.5} />
          </button>
          <button className="p-2 hover:bg-stone-100 rounded-full transition-colors relative">
            <ShoppingBag size={20} strokeWidth={1.5} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full border-2 border-white"></span>
          </button>
          <button className="hidden sm:block px-6 py-2.5 bg-stone-900 text-white rounded-full text-sm font-medium hover:bg-stone-800 transition-all hover:shadow-lg">
            Sign In
          </button>
          <button className="md:hidden p-2"><Menu size={20} strokeWidth={1.5} /></button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
