import React from 'react';

export const FishbowlScene: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`relative w-full max-w-[340px] ${className}`}>
      <svg viewBox="0 0 420 280" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full drop-shadow-xl">
        {/* Table surface */}
        <line x1="10" y1="248" x2="410" y2="248" stroke="#c49a6c" strokeWidth="1" strokeOpacity="0.25" strokeDasharray="4 6" />

        {/* ── FISHBOWL ── */}
        <g transform="translate(20, 20)">
          {/* Back rim */}
          <ellipse cx="140" cy="38" rx="82" ry="13" stroke="#f1e3d3" strokeWidth="1" strokeOpacity="0.25" fill="none" />

          {/* Paper slips */}
          <g transform="translate(82, 120) rotate(-18)">
            <rect x="0" y="0" width="96" height="30" rx="2" fill="#e7d5c3" />
            <text x="48" y="20" fontFamily="Lato, sans-serif" fontSize="12" fill="#2d1a10" textAnchor="middle" fontWeight="700">Wildcards</text>
          </g>
          <g transform="translate(100, 150) rotate(8)">
            <rect x="0" y="0" width="112" height="30" rx="2" fill="#f1e3d3" />
            <text x="56" y="20" fontFamily="Lato, sans-serif" fontSize="12" fill="#8f2f2a" textAnchor="middle" fontWeight="700">Relationships</text>
          </g>
          <g transform="translate(62, 178) rotate(-4)">
            <rect x="0" y="0" width="100" height="30" rx="2" fill="#e7d5c3" />
            <text x="50" y="20" fontFamily="Lato, sans-serif" fontSize="12" fill="#2d1a10" textAnchor="middle" fontWeight="700">Beliefs</text>
          </g>
          {/* extra folded slip */}
          <g transform="translate(168, 110) rotate(40)">
            <rect x="0" y="0" width="72" height="26" rx="2" fill="#d9c2ad" opacity="0.7" />
          </g>

          {/* Bowl body */}
          <path
            d="M58,38 C15,72 0,130 18,196 C36,252 82,268 140,268 C198,268 244,252 262,196 C280,130 265,72 222,38"
            stroke="#f1e3d3" strokeWidth="1.5" strokeOpacity="0.55" fill="url(#bowlFill)"
          />
          {/* Front lip */}
          <path d="M58,38 C58,50 96,56 140,56 C184,56 222,50 222,38" stroke="#f1e3d3" strokeWidth="1.5" strokeOpacity="0.75" fill="none" />
          {/* Highlight */}
          <path d="M28,120 C20,160 30,206 60,236" stroke="#ffffff" strokeWidth="3" strokeLinecap="round" strokeOpacity="0.15" fill="none" />
        </g>

        {/* ── WINE GLASS ── */}
        <g transform="translate(294, 50)">
          {/* Back rim */}
          <ellipse cx="48" cy="16" rx="32" ry="7" stroke="#f1e3d3" strokeWidth="1" strokeOpacity="0.25" fill="none" />

          {/* Wine back edge */}
          <ellipse cx="48" cy="56" rx="35" ry="7" fill="#5a1815" opacity="0.75" />
          {/* Wine body */}
          <path d="M13,56 C11,82 28,106 48,110 C68,106 85,82 83,56 Z" fill="#8f2f2a" opacity="0.9" />
          <path d="M13,56 C11,82 28,106 48,110 C68,106 85,82 83,56 Z" fill="url(#wineGrad)" />
          {/* Wine front edge */}
          <ellipse cx="48" cy="56" rx="35" ry="7" fill="#7a201c" />

          {/* Glass bowl */}
          <path d="M16,16 C8,48 8,88 40,112 C44,115 52,115 56,112 C88,88 88,48 80,16" stroke="#f1e3d3" strokeWidth="1.2" strokeOpacity="0.45" fill="url(#glassGrad)" />
          {/* Front rim */}
          <path d="M16,16 C16,22 30,25 48,25 C66,25 80,22 80,16" stroke="#f1e3d3" strokeWidth="1.2" strokeOpacity="0.7" fill="none" />
          {/* Stem */}
          <line x1="47" y1="113" x2="47" y2="205" stroke="#f1e3d3" strokeWidth="2.5" strokeOpacity="0.5" strokeLinecap="round" />
          <line x1="50" y1="113" x2="50" y2="205" stroke="#c49a6c" strokeWidth="0.8" strokeOpacity="0.35" strokeLinecap="round" />
          {/* Base */}
          <ellipse cx="48" cy="209" rx="28" ry="4" stroke="#f1e3d3" strokeWidth="1.2" strokeOpacity="0.5" fill="rgba(241,227,211,0.04)" />
          {/* Highlight */}
          <path d="M20,40 C15,65 20,88 32,105" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeOpacity="0.2" fill="none" />
        </g>

        {/* Gradient defs */}
        <defs>
          <linearGradient id="bowlFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f1e3d3" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#c49a6c" stopOpacity="0.04" />
          </linearGradient>
          <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f1e3d3" stopOpacity="0.12" />
            <stop offset="100%" stopColor="#c49a6c" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="wineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a63a34" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#2d1d1a" stopOpacity="0.85" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
};

export const FishbowlAndWine = FishbowlScene;
