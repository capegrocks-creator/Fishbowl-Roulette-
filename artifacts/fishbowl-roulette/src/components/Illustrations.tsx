import React from 'react';

export const FishbowlAndWine: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`relative w-full aspect-square max-w-[500px] mx-auto ${className}`}>
      {/* Decorative Glow */}
      <div className="absolute inset-0 bg-accent/10 rounded-full blur-[100px] -z-10 mix-blend-screen" />
      
      <svg viewBox="0 0 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl">
        {/* Table/Surface line */}
        <line x1="50" y1="420" x2="450" y2="420" stroke="#c49a6c" strokeWidth="1" strokeOpacity="0.3" strokeDasharray="4 4" />
        
        {/* === FISHBOWL === */}
        <g transform="translate(40, 90)">
          {/* Back glass lip */}
          <ellipse cx="160" cy="50" rx="90" ry="15" stroke="#f1e3d3" strokeWidth="1" strokeOpacity="0.3" fill="none" />
          
          {/* Slips of paper inside */}
          {/* Slip 1: Wildcards */}
          <g transform="translate(110, 180) rotate(-15)">
            <rect x="0" y="0" width="100" height="35" rx="2" fill="#e7d5c3" className="drop-shadow-md" />
            <path d="M100 0 C95 10, 95 25, 100 35 L0 35 C5 25, 5 10, 0 0 Z" fill="#d9c2ad" opacity="0.5" />
            <text x="50" y="22" fontFamily="Lato" fontSize="14" fill="#2d1a10" textAnchor="middle" fontWeight="bold">Wildcards</text>
          </g>
          
          {/* Slip 2: Relationships */}
          <g transform="translate(130, 210) rotate(10)">
            <rect x="0" y="0" width="120" height="35" rx="2" fill="#f1e3d3" className="drop-shadow-lg" />
            <text x="60" y="22" fontFamily="Lato" fontSize="14" fill="#8f2f2a" textAnchor="middle" fontWeight="bold">Relationships</text>
          </g>
          
          {/* Slip 3: Beliefs */}
          <g transform="translate(80, 240) rotate(-5)">
            <rect x="0" y="0" width="110" height="35" rx="2" fill="#e7d5c3" className="drop-shadow-xl" />
            <text x="55" y="22" fontFamily="Lato" fontSize="14" fill="#2d1a10" textAnchor="middle" fontWeight="bold">Beliefs</text>
          </g>

          {/* Slip 4: Random folded */}
          <g transform="translate(190, 160) rotate(45)">
            <rect x="0" y="0" width="80" height="30" rx="2" fill="#d9c2ad" />
          </g>

          {/* Main Fishbowl Body */}
          <path 
            d="M70,50 C20,90 0,160 20,240 C40,310 90,330 160,330 C230,330 280,310 300,240 C320,160 300,90 250,50" 
            stroke="#f1e3d3" 
            strokeWidth="2" 
            strokeOpacity="0.6" 
            fill="url(#glassGradient)" 
          />
          
          {/* Front glass lip */}
          <path d="M70,50 C70,60 110,65 160,65 C210,65 250,60 250,50" stroke="#f1e3d3" strokeWidth="2" strokeOpacity="0.8" fill="none" />
          
          {/* Glass Highlight */}
          <path d="M40,160 C30,200 40,260 80,300" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeOpacity="0.2" fill="none" style={{ filter: 'blur(2px)' }} />
          <path d="M280,140 C290,170 280,210 260,240" stroke="#c49a6c" strokeWidth="8" strokeLinecap="round" strokeOpacity="0.15" fill="none" style={{ filter: 'blur(4px)' }} />
        </g>

        {/* === WINE GLASS === */}
        <g transform="translate(320, 150)">
          {/* Back rim */}
          <ellipse cx="60" cy="20" rx="40" ry="8" stroke="#f1e3d3" strokeWidth="1" strokeOpacity="0.3" fill="none" />
          
          {/* Wine liquid back edge */}
          <ellipse cx="60" cy="70" rx="43" ry="8" fill="#5a1815" opacity="0.8" />
          
          {/* Wine liquid body */}
          <path d="M17,70 C15,100 35,130 60,135 C85,130 105,100 103,70 Z" fill="#8f2f2a" opacity="0.9" />
          <path d="M17,70 C15,100 35,130 60,135 C85,130 105,100 103,70 Z" fill="url(#wineGradient)" />
          
          {/* Wine liquid front edge */}
          <ellipse cx="60" cy="70" rx="43" ry="8" fill="#7a201c" />

          {/* Glass Bowl */}
          <path d="M20,20 C10,60 10,110 50,140 C55,143 65,143 70,140 C110,110 110,60 100,20" stroke="#f1e3d3" strokeWidth="1.5" strokeOpacity="0.5" fill="url(#wineGlassGradient)" />
          
          {/* Front rim */}
          <path d="M20,20 C20,25 38,28 60,28 C82,28 100,25 100,20" stroke="#f1e3d3" strokeWidth="1.5" strokeOpacity="0.8" fill="none" />
          
          {/* Stem */}
          <path d="M58,142 L58,260" stroke="#f1e3d3" strokeWidth="3" strokeOpacity="0.6" strokeLinecap="round" />
          <path d="M62,142 L62,260" stroke="#c49a6c" strokeWidth="1" strokeOpacity="0.4" strokeLinecap="round" />
          
          {/* Base */}
          <ellipse cx="60" cy="265" rx="35" ry="5" stroke="#f1e3d3" strokeWidth="1.5" strokeOpacity="0.6" fill="rgba(241, 227, 211, 0.05)" />
          <path d="M25,265 C25,262 40,258 60,258 C80,258 95,262 95,265" stroke="#f1e3d3" strokeWidth="1" strokeOpacity="0.4" fill="none" />

          {/* Glass Highlight */}
          <path d="M25,50 C20,80 25,110 40,130" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.25" fill="none" style={{ filter: 'blur(1px)' }} />
        </g>

        {/* Definitions for Gradients */}
        <defs>
          <linearGradient id="glassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f1e3d3" stopOpacity="0.1" />
            <stop offset="50%" stopColor="#ffffff" stopOpacity="0.0" />
            <stop offset="100%" stopColor="#c49a6c" stopOpacity="0.05" />
          </linearGradient>
          
          <linearGradient id="wineGlassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f1e3d3" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#c49a6c" stopOpacity="0.0" />
          </linearGradient>

          <linearGradient id="wineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a63a34" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#2d1d1a" stopOpacity="0.9" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};
