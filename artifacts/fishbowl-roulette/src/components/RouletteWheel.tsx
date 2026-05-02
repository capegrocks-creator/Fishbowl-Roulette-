import { useMemo } from 'react';

interface RouletteWheelProps {
  size?: number;
  isDark?: boolean;
  spinSeconds?: number;
}

const SEGMENTS = [
  'Relationships',
  'Beliefs',
  'Wildcards',
  'Career',
  'Family',
  'Faith',
  'Money',
  'Health',
];

export function RouletteWheel({
  size = 180,
  isDark = false,
  spinSeconds = 22,
}: RouletteWheelProps) {
  const r = 100;
  const cx = 0;
  const cy = 0;
  const segmentAngle = 360 / SEGMENTS.length;

  const gold = '#c49a6c';
  const goldDeep = '#9d7546';
  const red = isDark ? '#a63a34' : '#8f2f2a';
  const cream = '#f1e3d3';
  const dark = '#1a1008';

  const paths = useMemo(
    () =>
      SEGMENTS.map((label, i) => {
        const startAngle = (i * segmentAngle - 90) * (Math.PI / 180);
        const endAngle = ((i + 1) * segmentAngle - 90) * (Math.PI / 180);
        const x1 = cx + r * Math.cos(startAngle);
        const y1 = cy + r * Math.sin(startAngle);
        const x2 = cx + r * Math.cos(endAngle);
        const y2 = cy + r * Math.sin(endAngle);
        const largeArc = segmentAngle > 180 ? 1 : 0;
        const d = `M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`;
        const fill = i % 2 === 0 ? gold : red;
        const labelAngleDeg = i * segmentAngle + segmentAngle / 2 - 90;
        const labelAngleRad = labelAngleDeg * (Math.PI / 180);
        const labelR = r * 0.62;
        const lx = cx + labelR * Math.cos(labelAngleRad);
        const ly = cy + labelR * Math.sin(labelAngleRad);
        return { d, fill, label, lx, ly, rotate: labelAngleDeg + 90 };
      }),
    [segmentAngle, gold, red],
  );

  return (
    <div
      style={{
        width: size,
        height: size,
        position: 'relative',
        filter: isDark
          ? 'drop-shadow(0 14px 28px rgba(0,0,0,0.55))'
          : 'drop-shadow(0 8px 18px rgba(43,43,43,0.18))',
      }}
      aria-label="Spinning fishbowl roulette wheel"
      role="img"
    >
      <svg
        viewBox="-110 -110 220 220"
        width={size}
        height={size}
        style={{
          display: 'block',
          animation: `fbr-wheel-spin ${spinSeconds}s linear infinite`,
          transformOrigin: '50% 50%',
        }}
      >
        {/* Outer rim */}
        <circle
          cx={0}
          cy={0}
          r={108}
          fill={isDark ? '#3a2418' : '#5a3a26'}
        />
        <circle cx={0} cy={0} r={104} fill={dark} opacity={0.85} />

        {/* Segments */}
        {paths.map((p, i) => (
          <g key={i}>
            <path d={p.d} fill={p.fill} stroke={cream} strokeWidth={1.2} />
            <text
              x={p.lx}
              y={p.ly}
              transform={`rotate(${p.rotate} ${p.lx} ${p.ly})`}
              textAnchor="middle"
              dominantBaseline="middle"
              fill={cream}
              fontSize={9.5}
              fontFamily="var(--font-sans), system-ui, sans-serif"
              fontWeight={700}
              style={{ letterSpacing: '0.04em', textTransform: 'uppercase' }}
            >
              {p.label}
            </text>
          </g>
        ))}

        {/* Decorative dots between segments */}
        {SEGMENTS.map((_, i) => {
          const a = (i * segmentAngle - 90) * (Math.PI / 180);
          const dx = 96 * Math.cos(a);
          const dy = 96 * Math.sin(a);
          return (
            <circle key={`dot-${i}`} cx={dx} cy={dy} r={2.4} fill={cream} opacity={0.85} />
          );
        })}

        {/* Inner hub ring */}
        <circle cx={0} cy={0} r={28} fill={dark} stroke={gold} strokeWidth={2.5} />
        <circle cx={0} cy={0} r={22} fill={isDark ? '#0e0805' : '#241510'} />
        {/* Center monogram */}
        <text
          x={0}
          y={0.5}
          textAnchor="middle"
          dominantBaseline="middle"
          fill={gold}
          fontSize={14}
          fontFamily="var(--font-serif), Georgia, serif"
          fontStyle="italic"
          fontWeight={700}
        >
          FR
        </text>
        {/* Center pivot */}
        <circle cx={0} cy={0} r={3} fill={goldDeep} />
      </svg>

      {/* Pointer / ticker (does NOT rotate, sits on top at 12 o'clock) */}
      <svg
        viewBox="-110 -110 220 220"
        width={size}
        height={size}
        style={{
          display: 'block',
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
        }}
        aria-hidden="true"
      >
        <polygon
          points="0,-115 -8,-95 8,-95"
          fill={isDark ? cream : '#2b2b2b'}
          stroke={gold}
          strokeWidth={1.5}
          strokeLinejoin="round"
        />
        <circle cx={0} cy={-103} r={2.5} fill={gold} />
      </svg>

      <style>{`
        @keyframes fbr-wheel-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (prefers-reduced-motion: reduce) {
          svg[style*="fbr-wheel-spin"] { animation: none !important; }
        }
      `}</style>
    </div>
  );
}

export default RouletteWheel;
