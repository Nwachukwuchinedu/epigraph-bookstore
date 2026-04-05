import React, { useState, useRef } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { Star, ShoppingBag } from 'lucide-react';
import AbstractCover from './AbstractCover';
import MagneticButton from './MagneticButton';

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

interface InteractiveBookCardProps {
  book: Book;
  theme?: 'light' | 'dark';
  onAddToCart?: (title: string) => void;
}

const InteractiveBookCard: React.FC<InteractiveBookCardProps> = ({ book, theme = 'light', onAddToCart }) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  
  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);
  
  // Calculate tilt rotation based on mouse position
  const rotateX = useTransform(y, [0, 1], [15, -15]);
  const rotateY = useTransform(x, [0, 1], [-15, 15]);

  const springConfig = { stiffness: 300, damping: 30 };
  const springRotateX = useSpring(rotateX, springConfig);
  const springRotateY = useSpring(rotateY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current || isFlipped) return; // Disable tilt effect when viewing the back
    const rect = ref.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / rect.width);
    y.set(mouseY / rect.height);
  };

  const handleMouseLeave = () => {
    x.set(0.5);
    y.set(0.5);
  };

  const tagStyles = theme === 'dark' 
    ? "bg-stone-900 text-white border-stone-700 shadow-xl" 
    : "bg-white text-stone-900 border-stone-100 shadow-sm";

  return (
    <div className="relative mb-6 cursor-pointer w-full aspect-[2/3] z-20" style={{ perspective: "1000px" }}>
      {book.tag && (
        <div className={`absolute -top-3 -right-3 z-30 border px-3 py-1 rounded-full text-xs font-medium ${tagStyles}`}>
          {book.tag}
        </div>
      )}
      
      <motion.div
        ref={ref}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => setIsFlipped(!isFlipped)}
        style={{
          rotateX: isFlipped ? 0 : springRotateX,
          rotateY: isFlipped ? 180 : springRotateY,
          transformStyle: "preserve-3d"
        }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.7, type: "spring", stiffness: 260, damping: 20 }}
        className="w-full h-full relative"
      >
        {/* FRONT FACE */}
        <div className="absolute inset-0 [backface-visibility:hidden]">
          <AbstractCover {...book} />
        </div>
        
        {/* BACK FACE */}
        <div 
          className="absolute inset-0 [backface-visibility:hidden] bg-stone-900 text-stone-100 rounded-l-xl rounded-r-sm p-6 flex flex-col justify-between shadow-2xl border border-stone-800"
          style={{ transform: "rotateY(180deg)" }}
        >
          <div>
            <h4 className="text-xl font-medium mb-1 leading-tight text-white">{book.title}</h4>
            <p className="text-xs text-stone-400 mb-4 font-serif italic">by {book.author}</p>
            <div className="flex items-center gap-1 mb-4 text-orange-400">
              {[1,2,3,4,5].map(i => <Star key={i} size={12} fill="currentColor" />)}
            </div>
            <p className="text-sm text-stone-300 leading-relaxed line-clamp-5">
              {book.synopsis}
            </p>
          </div>
          
          <MagneticButton 
            onClick={(e) => { 
              e.stopPropagation(); // Prevents flipping the card when clicking Add to Cart
              if (onAddToCart) onAddToCart(book.title);
            }}
            className="w-full py-3 bg-white text-stone-900 rounded-lg text-sm font-medium hover:bg-stone-200 transition-colors flex items-center justify-center gap-2 mt-4"
          >
            <ShoppingBag size={16} /> Add to Cart
          </MagneticButton>
        </div>
      </motion.div>
    </div>
  );
};

export default InteractiveBookCard;
