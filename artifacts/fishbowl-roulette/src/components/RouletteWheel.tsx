interface RouletteWheelProps {
  size?: number;
  isDark?: boolean;
  spinSeconds?: number;
}

const BASE = import.meta.env.BASE_URL;
const LOGO_SRC = `${BASE}images/fishbowl-roulette-logo.png`;

/* The brand logo has 3 concentric zones:
     • Outer black band with gold "FISHBOWL ROULETTE" text  (STATIC)
     • Middle red/black roulette wheel ring                  (SPINS)
     • Inner white circle with the three fishbowls           (STATIC)
   We render the same image twice, stacked. The bottom copy is the full
   static logo; the top copy is masked to a thin annulus covering ONLY
   the red/black ring — that copy is what rotates. The mask radii are
   tuned to the actual logo proportions: red/black band is roughly
   52%–66% of the diameter from center. */
const SPIN_RING_MASK =
  'radial-gradient(circle at 50% 50%, transparent 0 51.5%, black 53% 65.5%, transparent 67% 100%)';

export function RouletteWheel({
  size = 340,
  isDark = false,
  spinSeconds = 14,
}: RouletteWheelProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        borderRadius: '50%',
        overflow: 'hidden',
        filter: isDark
          ? 'drop-shadow(0 18px 36px rgba(0,0,0,0.6))'
          : 'drop-shadow(0 10px 24px rgba(43,43,43,0.2))',
      }}
      aria-label="Fishbowl Roulette logo"
      role="img"
    >
      {/* STATIC base — full logo */}
      <img
        src={LOGO_SRC}
        alt="Fishbowl Roulette"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          objectFit: 'contain',
          position: 'absolute',
          inset: 0,
          userSelect: 'none',
        }}
        draggable={false}
      />

      {/* SPINNING overlay — same logo, masked to ONLY the red/black ring */}
      <img
        src={LOGO_SRC}
        alt=""
        aria-hidden="true"
        className="fbr-wheel-spin"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          objectFit: 'contain',
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          userSelect: 'none',
          WebkitMaskImage: SPIN_RING_MASK,
          maskImage: SPIN_RING_MASK,
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskSize: '100% 100%',
          maskSize: '100% 100%',
          transformOrigin: '50% 50%',
          // Animation duration is set via CSS variable below so it can
          // be customized per instance.
          animationDuration: `${spinSeconds}s`,
        }}
        draggable={false}
      />

      <style>{`
        @keyframes fbr-roulette-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        .fbr-wheel-spin {
          animation-name: fbr-roulette-spin;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .fbr-wheel-spin { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

export default RouletteWheel;
