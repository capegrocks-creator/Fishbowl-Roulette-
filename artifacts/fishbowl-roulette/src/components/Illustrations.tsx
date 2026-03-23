import React from 'react';

export const FishbowlScene: React.FC<{ className?: string }> = ({ className = "" }) => {
  return (
    <div className={`relative w-full ${className}`}>
      <svg
        viewBox="0 0 520 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full"
        style={{ filter: 'drop-shadow(0 20px 50px rgba(0,0,0,0.9))' }}
      >
        <defs>
          {/* Desk wood grain and shadow */}
          <linearGradient id="deskWood" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4a3728" />
            <stop offset="50%" stopColor="#3d2f1f" />
            <stop offset="100%" stopColor="#2a1f15" />
          </linearGradient>

          {/* Fishbowl glass */}
          <radialGradient id="bowlGlass" cx="40%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.35" />
            <stop offset="45%" stopColor="#c4a87e" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#1a0f0a" stopOpacity="0.45" />
          </radialGradient>

          {/* Wine glass */}
          <linearGradient id="glassShine" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.38" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Wine fill */}
          <linearGradient id="wineFill" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#a83a34" />
            <stop offset="50%" stopColor="#8f2f2a" />
            <stop offset="100%" stopColor="#5a1815" />
          </linearGradient>

          {/* Parchment paper */}
          <linearGradient id="paperSlip" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f0dcc8" />
            <stop offset="100%" stopColor="#d9b898" />
          </linearGradient>
        </defs>

        {/* ════════ DESK SURFACE ════════ */}
        <rect x="0" y="300" width="520" height="80" fill="url(#deskWood)" />
        <ellipse cx="260" cy="300" rx="260" ry="18" fill="rgba(0,0,0,0.35)" />

        {/* ════════ FISHBOWL ════════ */}
        <g transform="translate(80, 60)">
          {/* Bowl back rim */}
          <ellipse cx="110" cy="45" rx="95" ry="18" fill="none" stroke="#c9a87e" strokeWidth="2" strokeOpacity="0.6" />

          {/* Bowl body — main glass shape */}
          <path
            d="M 25,45 Q 10,90 15,160 Q 22,220 65,255 Q 110,280 155,280 Q 200,280 245,255 Q 288,220 295,160 Q 300,90 195,45 Z"
            fill="url(#bowlGlass)"
            stroke="#c9a87e"
            strokeWidth="2.5"
            strokeOpacity="0.5"
          />

          {/* Left side highlight */}
          <path
            d="M 30,50 Q 20,100 22,160 Q 25,200 35,240"
            stroke="#ffffff"
            strokeWidth="8"
            strokeOpacity="0.25"
            strokeLinecap="round"
            fill="none"
          />

          {/* Right side shadow */}
          <path
            d="M 195,45 Q 210,95 208,160 Q 205,210 195,255"
            stroke="#0a0603"
            strokeWidth="12"
            strokeOpacity="0.4"
            strokeLinecap="round"
            fill="none"
          />

          {/* Front rim */}
          <path
            d="M 25,45 Q 65,35 110,32 Q 155,35 195,45"
            stroke="#e7d5c3"
            strokeWidth="2.5"
            strokeOpacity="0.85"
            fill="none"
          />

          {/* Paper slips inside */}
          {/* Slip 1 */}
          <g transform="translate(70, 110) rotate(-16)">
            <rect x="0" y="0" width="100" height="32" rx="2" fill="url(#paperSlip)" />
            <text x="50" y="21" fontFamily="Georgia, serif" fontSize="12" fill="#3d2f1f" textAnchor="middle" fontWeight="bold">Beliefs</text>
          </g>

          {/* Slip 2 */}
          <g transform="translate(90, 160) rotate(8)">
            <rect x="0" y="0" width="120" height="32" rx="2" fill="url(#paperSlip)" />
            <text x="60" y="21" fontFamily="Georgia, serif" fontSize="12" fill="#5a3d2f" textAnchor="middle" fontWeight="bold">Relationships</text>
          </g>

          {/* Slip 3 */}
          <g transform="translate(55, 205) rotate(-6)">
            <rect x="0" y="0" width="105" height="32" rx="2" fill="url(#paperSlip)" />
            <text x="52" y="21" fontFamily="Georgia, serif" fontSize="12" fill="#3d2f1f" textAnchor="middle" fontWeight="bold">Wildcards</text>
          </g>

          {/* Bottom shadow inside bowl */}
          <ellipse cx="110" cy="265" rx="85" ry="16" fill="#1a0f0a" opacity="0.5" />
        </g>

        {/* ════════ WINE GLASS ════════ */}
        <g transform="translate(310, 80)">
          {/* Glass bowl */}
          <path
            d="M 30,20 Q 18,45 16,85 Q 15,110 32,135 Q 50,152 68,158 Q 86,152 104,135 Q 121,110 120,85 Q 118,45 106,20 Z"
            fill="url(#wineFill)"
            stroke="#b8956f"
            strokeWidth="2"
            strokeOpacity="0.6"
          />

          {/* Wine liquid fill */}
          <ellipse cx="68" cy="95" rx="40" ry="11" fill="#9d3630" opacity="0.95" />

          {/* Wine surface shine */}
          <path
            d="M 35,95 Q 50,88 68,90 Q 85,88 100,95"
            stroke="#d85555"
            strokeWidth="2"
            strokeOpacity="0.65"
            fill="none"
            strokeLinecap="round"
          />

          {/* Glass highlight left */}
          <path
            d="M 32,25 Q 26,50 26,90 Q 28,120 38,145"
            stroke="url(#glassShine)"
            strokeWidth="6"
            strokeOpacity="0.4"
            fill="none"
            strokeLinecap="round"
          />

          {/* Glass rim */}
          <ellipse cx="68" cy="20" rx="40" ry="8" fill="none" stroke="#d4bfa8" strokeWidth="2" strokeOpacity="0.8" />

          {/* Stem */}
          <line x1="63" y1="160" x2="61" y2="255" stroke="#c49a6c" strokeWidth="3.5" strokeOpacity="0.7" strokeLinecap="round" />
          <line x1="73" y1="160" x2="75" y2="255" stroke="#d4bfa8" strokeWidth="2" strokeOpacity="0.5" strokeLinecap="round" />

          {/* Base */}
          <ellipse cx="68" cy="258" rx="32" ry="6" fill="#5a4a38" stroke="#c9a87e" strokeWidth="1.5" strokeOpacity="0.6" />
          <ellipse cx="68" cy="260" rx="28" ry="4.5" fill="rgba(0,0,0,0.4)" />
        </g>

        {/* ════════ WARM GLOW ════════ */}
        <ellipse cx="140" cy="320" rx="120" ry="14" fill="#c49a6c" opacity="0.12" />
        <ellipse cx="360" cy="310" rx="70" ry="10" fill="#8f2f2a" opacity="0.18" />
      </svg>
    </div>
  );
};

export const FishbowlAndWine = FishbowlScene;
