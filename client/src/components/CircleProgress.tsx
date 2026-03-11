interface CircleProgressProps {
  percent: number;
  color: string;
  label: string;
}

export default function CircleProgress({ percent, color, label }: CircleProgressProps) {
  const r = 28;
  const circ = 2 * Math.PI * r;
  const offset = circ - (percent / 100) * circ;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
      <svg width="72" height="72" viewBox="0 0 72 72">
        {/* Track */}
        <circle cx="36" cy="36" r={r} fill="none" stroke="#2a3441" strokeWidth="7" />
        {/* Progress */}
        <circle
          cx="36" cy="36" r={r}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform="rotate(-90 36 36)"
          style={{ transition: "stroke-dashoffset 0.5s ease" }}
        />
        {/* Percent text */}
        <text
          x="36" y="40"
          textAnchor="middle"
          fontSize="13"
          fontWeight="800"
          fill="#e6edf3"
          fontFamily="'DM Sans', sans-serif"
        >
          {percent}%
        </text>
      </svg>
      <span style={{
        fontSize: 11, color: "#7d8fa0",
        display: "flex", alignItems: "center", gap: 4, fontWeight: 600,
      }}>
        <span style={{
          width: 8, height: 8, borderRadius: "50%",
          background: color, display: "inline-block", flexShrink: 0,
        }} />
        {label}
      </span>
    </div>
  );
}