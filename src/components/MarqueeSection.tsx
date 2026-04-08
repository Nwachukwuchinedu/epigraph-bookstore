import React, { useState } from 'react';
import { motion, useMotionValue, useAnimationFrame, useTransform } from 'framer-motion';

const MarqueeSection: React.FC = () => {
  const baseX = useMotionValue(0);
  const [isHovered, setIsHovered] = useState(false);
  
  useAnimationFrame((_t, delta) => {
    // Significantly slower glide for premium feel
    let moveBy = (isHovered ? 0.2 : -1) * 0.005 * delta;
    let newX = baseX.get() + moveBy;
    if (newX <= -50) newX += 50;
    if (newX >= 0) newX -= 50;
    baseX.set(newX);
  });
  
  const x = useTransform(baseX, (v) => `${v}%`);
  const marqueeText = " • NEW ARRIVALS • RARE EDITIONS • STAFF PICKS • BESTSELLERS • LIMITED PRINTS • SIGNED COPIES";
  const textBlock = marqueeText.repeat(3);
  
  return (
    <div 
      className="py-5 border-y border-stone-200 bg-white text-stone-900 overflow-hidden flex whitespace-nowrap cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <motion.div style={{ x }} className="flex whitespace-nowrap text-sm font-medium tracking-widest uppercase text-stone-400">
        <span className="px-4 hover:text-stone-900 transition-colors">{textBlock}</span>
        <span className="px-4 hover:text-stone-900 transition-colors">{textBlock}</span>
      </motion.div>
    </div>
  );
};

export default MarqueeSection;
