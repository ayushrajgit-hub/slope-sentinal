export default function RiskGauge({ value = 0 }) {
  // value: 0-100
  const clampedValue = Math.min(100, Math.max(0, value));
  
  // SVG arc parameters
  const cx = 120;
  const cy = 110;
  const r = 90;
  const startAngle = Math.PI; // 180 degrees (left)
  const endAngle = 0; // 0 degrees (right)
  
  // Calculate the needle angle
  const needleAngle = Math.PI - (clampedValue / 100) * Math.PI;
  const needleLength = 75;
  const needleX = cx + needleLength * Math.cos(needleAngle);
  const needleY = cy - needleLength * Math.sin(needleAngle);

  // Color based on value
  const getColor = (v) => {
    if (v < 30) return '#00F0FF';
    if (v < 60) return '#FBBF24';
    if (v < 85) return '#F97316';
    return '#EF4444';
  };

  const getLabel = (v) => {
    if (v < 30) return 'Low Risk Zone';
    if (v < 60) return 'Medium Risk Zone';
    if (v < 85) return 'High Risk Zone';
    return 'Critical Risk Zone';
  };

  const color = getColor(clampedValue);
  const label = getLabel(clampedValue);

  // Create the arc path for the filled portion
  const filledAngle = Math.PI - (clampedValue / 100) * Math.PI;
  
  // Background arc (full semicircle)
  const bgArcStart = { x: cx + r * Math.cos(Math.PI), y: cy - r * Math.sin(Math.PI) };
  const bgArcEnd = { x: cx + r * Math.cos(0), y: cy - r * Math.sin(0) };
  const bgArcPath = `M ${bgArcStart.x} ${bgArcStart.y} A ${r} ${r} 0 0 1 ${bgArcEnd.x} ${bgArcEnd.y}`;

  // Filled arc
  const fillArcEnd = { x: cx + r * Math.cos(filledAngle), y: cy - r * Math.sin(filledAngle) };
  const largeArc = clampedValue > 50 ? 1 : 0;
  const fillArcPath = `M ${bgArcStart.x} ${bgArcStart.y} A ${r} ${r} 0 ${largeArc} 1 ${fillArcEnd.x} ${fillArcEnd.y}`;

  // Tick marks
  const ticks = [0, 25, 50, 75, 100];

  return (
    <div className="risk-gauge">
      <svg viewBox="0 0 240 140" className="risk-gauge__svg">
        {/* Gradient definition */}
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00F0FF" />
            <stop offset="40%" stopColor="#FBBF24" />
            <stop offset="70%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#EF4444" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Background arc */}
        <path
          d={bgArcPath}
          fill="none"
          stroke="rgba(148, 163, 184, 0.15)"
          strokeWidth="14"
          strokeLinecap="round"
        />

        {/* Filled arc */}
        <path
          d={fillArcPath}
          fill="none"
          stroke="url(#gaugeGrad)"
          strokeWidth="14"
          strokeLinecap="round"
          filter="url(#glow)"
          style={{
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />

        {/* Tick marks */}
        {ticks.map((tick) => {
          const angle = Math.PI - (tick / 100) * Math.PI;
          const innerR = r + 12;
          const outerR = r + 20;
          const x1 = cx + innerR * Math.cos(angle);
          const y1 = cy - innerR * Math.sin(angle);
          const x2 = cx + outerR * Math.cos(angle);
          const y2 = cy - outerR * Math.sin(angle);
          const labelR = r + 28;
          const lx = cx + labelR * Math.cos(angle);
          const ly = cy - labelR * Math.sin(angle);
          return (
            <g key={tick}>
              <line
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke="rgba(148, 163, 184, 0.3)"
                strokeWidth="1.5"
              />
              <text
                x={lx} y={ly}
                textAnchor="middle"
                dominantBaseline="middle"
                fill="rgba(148, 163, 184, 0.5)"
                fontSize="8"
                fontFamily="var(--font-mono)"
              >
                {tick}
              </text>
            </g>
          );
        })}

        {/* Needle */}
        <line
          x1={cx} y1={cy}
          x2={needleX} y2={needleY}
          stroke={color}
          strokeWidth="2.5"
          strokeLinecap="round"
          filter="url(#glow)"
          style={{
            transition: 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)',
          }}
        />

        {/* Center dot */}
        <circle cx={cx} cy={cy} r="6" fill={color} filter="url(#glow)"
          style={{ transition: 'fill 0.6s ease' }}
        />
        <circle cx={cx} cy={cy} r="3" fill="var(--bg-deep)" />

        {/* Value text */}
        <text
          x={cx} y={cy + 28}
          textAnchor="middle"
          fill={color}
          fontSize="22"
          fontWeight="800"
          fontFamily="var(--font-mono)"
          style={{ transition: 'fill 0.6s ease' }}
        >
          {Math.round(clampedValue)}
        </text>
      </svg>
      <div className="risk-gauge__label" style={{ color }}>
        {label}
      </div>
    </div>
  );
}
