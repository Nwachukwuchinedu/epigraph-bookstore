import { useState } from 'react';
import { motion, useSpring, useScroll, AnimatePresence } from 'framer-motion';
import { ShoppingBag, BookOpen } from 'lucide-react';

// Data
import { featuredBooks, categories } from './data/mockData';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import MarqueeSection from './components/MarqueeSection';
import CuratedSelection from './components/CuratedSelection';
import TrendingNow from './components/TrendingNow';
import DraggableShelf from './components/DraggableShelf';
import BentoGridCategories from './components/BentoGridCategories';
import PinnedStorySection from './components/PinnedStorySection';
import AuthorSpotlight from './components/AuthorSpotlight';
import QuoteSection from './components/QuoteSection';
import ServicesSection from './components/ServicesSection';

// UI Components
import FilmGrain from './components/ui/FilmGrain';
import ChapterNav from './components/ui/ChapterNav';

import './App.css';

function App() {
  const [route, setRoute] = useState('home');
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleAddToCart = (title: string) => {
    setToastMessage(`Added "${title}" to cart!`);
    setTimeout(() => setToastMessage(null), 3000);
  };

  return (
    <div className="w-full min-h-screen bg-[#FAFAFA] text-stone-900 font-sans selection:bg-stone-200 overflow-x-hidden">
      <FilmGrain />
      <motion.div
        className="fixed top-0 left-0 right-0 h-1 bg-stone-900 origin-left z-[100]"
        style={{ scaleX }}
      />
      
      <Navbar setRoute={setRoute} currentRoute={route} />
      {route === 'home' && <ChapterNav />}

      <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
        {route === 'home' ? (
          <motion.div
            key="home"
            initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <HeroSection />
            <MarqueeSection />
            <CuratedSelection books={featuredBooks} onAddToCart={handleAddToCart} />
            <TrendingNow books={featuredBooks} onAddToCart={handleAddToCart} />
            <DraggableShelf books={[...featuredBooks].reverse()} onAddToCart={handleAddToCart} />
            <BentoGridCategories categories={categories} />
            <PinnedStorySection />
            <AuthorSpotlight />
            <QuoteSection />
            <ServicesSection />
            <Footer />

            <AnimatePresence>
              {toastMessage && (
                <motion.div
                  initial={{ opacity: 0, y: 50, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 20, scale: 0.9 }}
                  className="fixed bottom-8 right-8 z-[200] bg-stone-900 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-4 border border-stone-800"
                >
                  <div className="bg-orange-500/20 p-2 rounded-full text-orange-400">
                    <ShoppingBag size={18} strokeWidth={2} />
                  </div>
                  <span className="font-medium text-sm tracking-wide">{toastMessage}</span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key="about"
            initial={{ opacity: 0, y: 20, filter: "blur(5px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -20, filter: "blur(5px)" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="pt-48 pb-32 px-6 max-w-3xl mx-auto min-h-screen flex flex-col items-center justify-center text-center relative z-10"
          >
            <BookOpen className="text-stone-300 mb-8" size={48} strokeWidth={1} />
            <p className="text-stone-400 tracking-widest uppercase text-sm mb-6 font-medium">Under Construction</p>
            <h2 className="text-4xl md:text-6xl font-medium mb-6 tracking-tight">The Next Chapter<br/>is Being Written.</h2>
            <p className="text-lg text-stone-500 mb-10 leading-relaxed">
              We are currently curating the details for this section. Check back soon for deeper insights into our collections, editorial journals, and the story behind Epigraph.
            </p>
            <button 
              onClick={() => setRoute('home')} 
              className="px-8 py-4 bg-stone-900 text-white rounded-full font-medium hover:bg-stone-800 transition-all hover:scale-105"
            >
              Return Home
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
