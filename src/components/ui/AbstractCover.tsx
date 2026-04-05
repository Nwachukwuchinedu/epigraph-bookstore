import React from 'react';

interface AbstractCoverProps {
  title: string;
  author: string;
  color: string;
  textColor: string;
}

const AbstractCover: React.FC<AbstractCoverProps> = ({ title, author, color, textColor }) => (
  <div className={`relative w-full aspect-[2/3] bg-gradient-to-br ${color} rounded-r-xl rounded-l-sm shadow-inner p-6 flex flex-col justify-between overflow-hidden group-hover:shadow-2xl transition-all duration-500 ease-out`}>
    {/* Book spine effect */}
    <div className="absolute left-0 top-0 bottom-0 w-2 bg-black/10 z-10"></div>
    <div className="absolute left-2 top-0 bottom-0 w-px bg-white/20 z-10"></div>
    
    <div className="z-20">
      <h3 className={`font-medium text-xl md:text-2xl leading-tight tracking-tight ${textColor}`}>{title}</h3>
    </div>
    <div className="z-20">
      <p className={`text-sm tracking-widest uppercase opacity-70 ${textColor}`}>{author}</p>
    </div>

    {/* Decorative abstract shape */}
    <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-white/10 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
  </div>
);

export default AbstractCover;
