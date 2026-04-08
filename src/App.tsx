import { useState, lazy, Suspense } from 'react';
import { motion, useSpring, useScroll, AnimatePresence } from 'framer-motion';
import { ShoppingBag, BookOpen, Loader2 } from 'lucide-react';
import { ReactLenis } from 'lenis/react';

// Data
import { featuredBooks, categories } from './data/mockData';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HeroSection from './components/HeroSection';
import MarqueeSection from './components/MarqueeSection';
// Lazy-loaded Components for Performance
const DraggableShelf = lazy(() => import('./components/DraggableShelf'));
const BookStackSection = lazy(() => import('./components/BookStackSection'));
const CuratedSelection = lazy(() => import('./components/CuratedSelection'));
const TrendingNow = lazy(() => import('./components/TrendingNow'));
const BentoGridCategories = lazy(() => import('./components/BentoGridCategories'));

// Static Components
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
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothWheel: true, syncTouch: true }}>
      <div className="relative w-full min-h-screen bg-[#FAFAFA] text-stone-900 font-sans selection:bg-stone-200">
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
            className="relative"
          >
            <HeroSection />
            <MarqueeSection />
           <Suspense fallback={
              <div className="h-screen w-full flex items-center justify-center bg-stone-50">
                <div className="flex flex-col items-center gap-4">
                  <Loader2 className="animate-spin text-stone-300" size={32} />
                  <p className="text-stone-400 text-sm tracking-widest uppercase font-medium">Curating Experience...</p>
                </div>
              </div>
            }>
              <CuratedSelection books={featuredBooks} onAddToCart={handleAddToCart} />
              <TrendingNow books={featuredBooks} onAddToCart={handleAddToCart} />
              <DraggableShelf books={[...featuredBooks].reverse()} onAddToCart={handleAddToCart} />
              <BookStackSection />
              <BentoGridCategories categories={categories} />
              <div className="relative z-10 bg-white">
                <AuthorSpotlight />
                <QuoteSection />
                <ServicesSection />
              </div>
              <Footer />
            </Suspense>

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
    </ReactLenis>
  );
}

export default App;
