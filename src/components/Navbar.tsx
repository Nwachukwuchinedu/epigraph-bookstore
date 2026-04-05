import React, { useState, useEffect } from 'react';
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
        <div className="flex items-center gap-8">
          <a href="#" onClick={(e) => { e.preventDefault(); setRoute('home'); }} className="text-2xl font-semibold tracking-tighter text-stone-900">EPIGRAPH.</a>
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-500">
            <a href="#" onClick={(e) => { e.preventDefault(); setRoute('home'); }} className={`transition-colors ${currentRoute === 'home' ? 'text-stone-900' : 'hover:text-stone-900'}`}>Shop</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setRoute('about'); }} className={`transition-colors ${currentRoute === 'about' ? 'text-stone-900' : 'hover:text-stone-900'}`}>Collections</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setRoute('about'); }} className={`transition-colors ${currentRoute === 'about' ? 'text-stone-900' : 'hover:text-stone-900'}`}>Journal</a>
            <a href="#" onClick={(e) => { e.preventDefault(); setRoute('about'); }} className={`transition-colors ${currentRoute === 'about' ? 'text-stone-900' : 'hover:text-stone-900'}`}>About</a>
          </div>
        </div>

        <div className="flex items-center gap-4 text-stone-900">
          <button className="p-2 hover:bg-stone-100 rounded-full transition-colors"><Search size={20} strokeWidth={1.5} /></button>
          <button className="p-2 hover:bg-stone-100 rounded-full transition-colors relative">
            <ShoppingBag size={20} strokeWidth={1.5} />
            <span className="absolute top-1 right-1 w-2 h-2 bg-orange-500 rounded-full"></span>
          </button>
          <button className="md:hidden p-2"><Menu size={20} strokeWidth={1.5} /></button>
          <button className="hidden md:block px-5 py-2 bg-stone-900 text-white rounded-full text-sm font-medium hover:bg-stone-800 hover:scale-105 transition-all duration-300">
            Sign In
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
