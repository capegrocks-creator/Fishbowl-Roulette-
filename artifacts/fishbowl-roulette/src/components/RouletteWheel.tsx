interface RouletteWheelProps {
  size?: number;
  isDark?: boolean;
  spinSeconds?: number;
}

const BASE = import.meta.env.BASE_URL;
const LOGO_SRC = `${BASE}images/fishbowl-roulette-logo.png`;

export function RouletteWheel({
  size = 180,
  isDark = false,
  spinSeconds = 28,
}: RouletteWheelProps) {
  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        filter: isDark
          ? 'drop-shadow(0 16px 32px rgba(0,0,0,0.6))'
          : 'drop-shadow(0 8px 20px rgba(43,43,43,0.18))',
      }}
      aria-label="Fishbowl Roulette logo"
      role="img"
    >
      <img
        src={LOGO_SRC}
        alt="Fishbowl Roulette"
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
          objectFit: 'contain',
          borderRadius: '50%',
          animation: `fbr-wheel-spin ${spinSeconds}s linear infinite`,
          transformOrigin: '50% 50%',
        }}
        draggable={false}
      />

      <style>{`
        @keyframes fbr-wheel-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          img[alt="Fishbowl Roulette"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

export default RouletteWheel;
