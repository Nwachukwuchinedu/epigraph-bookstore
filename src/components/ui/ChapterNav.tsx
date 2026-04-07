import React, { useState, useEffect } from 'react';

const ChapterNav: React.FC = () => {
  const sections = ['hero', 'curated', 'trending', 'archives', 'explore', 'spotlight', 'quote', 'services'];
  const [active, setActive] = useState('hero');

  useEffect(() => {
    const handleScroll = () => {
      let current = 'hero';
      sections.forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          // If the section is spanning the middle of the viewport
          if (rect.top <= window.innerHeight / 2 && rect.bottom >= window.innerHeight / 2) {
            current = id;
          }
        }
      });
      setActive(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden lg:flex flex-col gap-4">
      {sections.map((id) => (
        <div key={id} className="relative group flex items-center justify-end">
          <span className={`absolute right-6 mr-2 text-xs font-medium uppercase tracking-widest transition-all duration-300 pointer-events-none whitespace-nowrap
            ${active === id ? 'opacity-100 text-stone-900 translate-x-0' : 'opacity-0 text-stone-400 translate-x-4 group-hover:opacity-100 group-hover:translate-x-0'}
            ${(id === 'trending' || id === 'quote') ? 'text-white/90' : ''}  
          `}>
            {id}
          </span>
          <button 
            onClick={() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })}
            className={`w-2 transition-all duration-500 rounded-full ${active === id ? 'h-8 bg-orange-500' : 'h-2 bg-stone-300 group-hover:bg-stone-400'}
              ${(id === 'trending' || id === 'quote') && active !== id ? 'bg-stone-700 group-hover:bg-stone-500' : ''}
            `}
            aria-label={`Scroll to ${id}`}
          />
        </div>
      ))}
    </div>
  );
};

export default ChapterNav;
