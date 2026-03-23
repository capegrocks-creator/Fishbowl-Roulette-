import React from 'react';

export const FishbowlScene: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`relative w-full ${className}`}>
      <svg
        viewBox="0 0 480 320"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
        style={{ filter: 'drop-shadow(0 12px 40px rgba(0,0,0,0.8))' }}
      >
        <defs>
          {/* Fishbowl body — glassy warm tint */}
          <radialGradient id="fb-bowl" cx="38%" cy="32%" r="62%">
            <stop offset="0%" stopColor="#c9a87e" stopOpacity="0.28" />
            <stop offset="50%" stopColor="#7a5230" stopOpacity="0.14" />
            <stop offset="100%" stopColor="#1a0e09" stopOpacity="0.55" />
          </radialGradient>

          {/* Bowl left-edge glass reflection */}
          <linearGradient id="fb-reflect" x1="0%" y1="20%" x2="100%" y2="80%">
            <stop offset="0%" stopColor="#f1e3d3" stopOpacity="0.72" />
            <stop offset="40%" stopColor="#e7d5c3" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#c49a6c" stopOpacity="0" />
          </linearGradient>

          {/* Wine fill */}
          <linearGradient id="fb-wine" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#c0392b" stopOpacity="1" />
            <stop offset="60%" stopColor="#8f2f2a" stopOpacity="1" />
            <stop offset="100%" stopColor="#3d0e0c" stopOpacity="1" />
          </linearGradient>

          {/* Wine surface shine */}
          <radialGradient id="fb-wine-shine" cx="35%" cy="35%" r="60%">
            <stop offset="0%" stopColor="#e05050" stopOpacity="0.65" />
            <stop offset="100%" stopColor="#5a1815" stopOpacity="0.9" />
          </radialGradient>

          {/* Glass bowl fill — barely there tint */}
          <linearGradient id="fb-glass" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f1e3d3" stopOpacity="0.10" />
            <stop offset="100%" stopColor="#2d1d1a" stopOpacity="0.32" />
          </linearGradient>

          {/* Stem gradient */}
          <linearGradient id="fb-stem" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#f1e3d3" stopOpacity="0.75" />
            <stop offset="50%" stopColor="#e7d5c3" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#c49a6c" stopOpacity="0.55" />
          </linearGradient>

          {/* Parchment slips */}
          <linearGradient id="fb-slip1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f0e0cc" />
            <stop offset="100%" stopColor="#d4b896" />
          </linearGradient>
          <linearGradient id="fb-slip2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ede4d8" />
            <stop offset="100%" stopColor="#c8a882" />
          </linearGradient>

          {/* Table */}
          <linearGradient id="fb-table" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4a2d16" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#1a1210" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* ── TABLE SURFACE ── */}
        <ellipse cx="210" cy="298" rx="200" ry="16" fill="url(#fb-table)" />
        <line x1="0" y1="292" x2="480" y2="292" stroke="#c49a6c" strokeWidth="0.8" strokeOpacity="0.22" />

        {/* ════════════════════════
            FISHBOWL (left)
        ════════════════════════ */}
        <g transform="translate(14, 8)">

          {/* Back rim ellipse */}
          <ellipse cx="148" cy="44" rx="94" ry="16" fill="#1e100a" opacity="0.7" />
          <ellipse cx="148" cy="44" rx="94" ry="16" fill="none" stroke="#c9a87e" strokeWidth="1.5" strokeOpacity="0.45" />

          {/* Bowl glass body */}
          <path
            d="M54,44 C0,86 -16,156 10,222 C34,278 90,296 148,296 C206,296 262,278 286,222 C312,156 296,86 242,44 Z"
            fill="url(#fb-bowl)"
          />

          {/* ── Paper slips ── */}
          {/* Slip 1 — Beliefs */}
          <g transform="translate(60,130) rotate(-13)">
            <rect x="0" y="0" width="114" height="36" rx="3" fill="url(#fb-slip1)" />
            <rect x="0" y="0" width="114" height="36" rx="3" fill="none" stroke="#a07850" strokeWidth="0.7" strokeOpacity="0.5" />
            {/* dog-ear corner */}
            <path d="M104,0 L114,10 L104,10 Z" fill="#c4a07a" />
            <text x="55" y="23" fontFamily="Georgia, serif" fontSize="14" fill="#2d1a10" textAnchor="middle" fontWeight="bold">Beliefs</text>
          </g>

          {/* Slip 2 — Relationships */}
          <g transform="translate(78,172) rotate(7)">
            <rect x="0" y="0" width="138" height="36" rx="3" fill="url(#fb-slip2)" />
            <rect x="0" y="0" width="138" height="36" rx="3" fill="none" stroke="#a07850" strokeWidth="0.7" strokeOpacity="0.4" />
            <path d="M128,0 L138,10 L128,10 Z" fill="#bea07e" />
            <text x="68" y="23" fontFamily="Georgia, serif" fontSize="14" fill="#8f2f2a" textAnchor="middle" fontWeight="bold">Relationships</text>
          </g>

          {/* Slip 3 — Wildcards */}
          <g transform="translate(50,218) rotate(-4)">
            <rect x="0" y="0" width="124" height="36" rx="3" fill="url(#fb-slip1)" opacity="0.95" />
            <path d="M114,0 L124,10 L114,10 Z" fill="#c4a07a" />
            <text x="60" y="23" fontFamily="Georgia, serif" fontSize="14" fill="#2d1a10" textAnchor="middle" fontWeight="bold">Wildcards</text>
          </g>

          {/* Blank slip at back */}
          <g transform="translate(182,108) rotate(36)">
            <rect x="0" y="0" width="86" height="30" rx="2" fill="#d9c2ad" opacity="0.55" />
          </g>

          {/* Bowl outline */}
          <path
            d="M54,44 C0,86 -16,156 10,222 C34,278 90,296 148,296 C206,296 262,278 286,222 C312,156 296,86 242,44"
            stroke="#d4bfa8" strokeWidth="2.2" strokeOpacity="0.68" fill="none"
          />

          {/* Front rim */}
          <path d="M54,44 C54,62 98,72 148,72 C198,72 242,62 242,44"
            stroke="#e7d5c3" strokeWidth="2.2" strokeOpacity="0.85" fill="none" />
          <path d="M54,44 C54,62 98,72 148,72 C198,72 242,62 242,44"
            fill="rgba(241,227,211,0.09)" />

          {/* Left glass highlight */}
          <path d="M54,50 C26,94 14,152 24,210 C32,248 52,272 76,286"
            stroke="#f1e3d3" strokeWidth="4.5" strokeLinecap="round" strokeOpacity="0.38" fill="none" />
          <path d="M58,58 C34,100 22,156 30,212 C38,250 58,274 82,288"
            stroke="#ffffff" strokeWidth="1.8" strokeLinecap="round" strokeOpacity="0.22" fill="none" />

          {/* Right shadow */}
          <path d="M242,44 C270,88 282,150 270,208 C258,256 232,280 206,292"
            stroke="#100806" strokeWidth="22" strokeLinecap="round" strokeOpacity="0.42" fill="none" />

          {/* Bottom depth */}
          <ellipse cx="148" cy="284" rx="108" ry="16" fill="#1a0e09" opacity="0.5" />

          {/* Rim top highlight */}
          <path d="M78,38 C106,30 130,28 148,28 C166,28 190,30 218,38"
            stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.3" fill="none" />
        </g>

        {/* ════════════════════════
            WINE GLASS (right)
        ════════════════════════ */}
        <g transform="translate(334, 26)">

          {/* Rim back */}
          <ellipse cx="54" cy="20" rx="40" ry="10" fill="#130a06" opacity="0.75" />
          <ellipse cx="54" cy="20" rx="40" ry="10" fill="none" stroke="#c9a87e" strokeWidth="1.2" strokeOpacity="0.38" />

          {/* Wine body */}
          <path d="M14,64 C12,96 30,126 54,132 C78,126 96,96 94,64 Z" fill="url(#fb-wine)" />
          {/* Wine surface */}
          <ellipse cx="54" cy="64" rx="40" ry="10" fill="url(#fb-wine-shine)" />
          <ellipse cx="54" cy="64" rx="40" ry="10" fill="none" stroke="#6b1a18" strokeWidth="2.5" strokeOpacity="0.9" />
          {/* Surface crescent highlight */}
          <path d="M22,59 C30,53 44,52 54,56" stroke="#e06060" strokeWidth="2.2" strokeLinecap="round" strokeOpacity="0.6" fill="none" />

          {/* Glass bowl */}
          <path
            d="M14,20 C2,60 2,108 42,136 C46,140 62,140 66,136 C106,108 106,60 94,20 Z"
            fill="url(#fb-glass)"
          />

          {/* Glass bowl outline */}
          <path
            d="M14,20 C2,60 2,108 42,136 C46,140 62,140 66,136 C106,108 106,60 94,20"
            stroke="#d4bfa8" strokeWidth="1.8" strokeOpacity="0.55" fill="none"
          />

          {/* Front rim */}
          <ellipse cx="54" cy="20" rx="40" ry="10" fill="none" stroke="#e7d5c3" strokeWidth="2.2" strokeOpacity="0.90" />
          {/* Rim top shine */}
          <path d="M26,15 C36,11 46,10 54,10 C62,10 72,11 82,15"
            stroke="#ffffff" strokeWidth="1.5" strokeOpacity="0.42" fill="none" />

          {/* Left glass highlight streak */}
          <path d="M14,22 C4,62 4,108 34,136"
            stroke="#f1e3d3" strokeWidth="6" strokeLinecap="round" strokeOpacity="0.28" fill="none" />
          <path d="M16,26 C6,66 6,110 36,136"
            stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeOpacity="0.22" fill="none" />

          {/* Right shadow */}
          <path d="M94,20 C106,60 106,108 66,136"
            stroke="#100806" strokeWidth="14" strokeLinecap="round" strokeOpacity="0.55" fill="none" />

          {/* Stem */}
          <path d="M48,138 L46,244 L62,244 L60,138 Z" fill="url(#fb-stem)" />
          <line x1="49" y1="138" x2="47" y2="244" stroke="#ffffff" strokeWidth="1" strokeOpacity="0.28" />

          {/* Base */}
          <ellipse cx="54" cy="248" rx="34" ry="6" fill="#3d2010" opacity="0.95" />
          <ellipse cx="54" cy="248" rx="34" ry="6" fill="none" stroke="#d4bfa8" strokeWidth="1.5" strokeOpacity="0.55" />
          <path d="M28,244 C38,240 48,239 54,239 C60,239 70,240 80,244"
            stroke="#e7d5c3" strokeWidth="1" strokeOpacity="0.4" fill="none" />
          {/* Base shadow */}
          <ellipse cx="54" cy="254" rx="30" ry="4.5" fill="#100806" opacity="0.45" />
        </g>

        {/* Warm glow pools under each object */}
        <ellipse cx="162" cy="296" rx="130" ry="11" fill="#c49a6c" opacity="0.10" />
        <ellipse cx="388" cy="296" rx="50" ry="8" fill="#8f2f2a" opacity="0.25" />
      </svg>
    </div>
  );
};

export const FishbowlAndWine = FishbowlScene;
