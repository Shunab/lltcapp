"use client";

export default function RankChart({ rankHistory }) {
  if (!rankHistory || rankHistory.length === 0) return null;

  const width = 300;
  const height = 120;
  const padding = 20;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const maxRank = Math.max(...rankHistory);
  const minRank = Math.min(...rankHistory);
  const rankRange = maxRank - minRank || 1;

  const points = rankHistory.map((rank, index) => {
    const x = padding + (index / (rankHistory.length - 1 || 1)) * chartWidth;
    const y =
      padding +
      chartHeight -
      ((rank - minRank) / rankRange) * chartHeight;
    return `${x},${y}`;
  });

  const pathData = `M ${points.join(" L ")}`;

  return (
    <div className="rounded-lg border border-border-subtle bg-card-elevated p-4">
      <p className="mb-3 text-xs font-medium text-muted">Rank Over Time</p>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        {/* Grid lines */}
        {[minRank, maxRank].map((rank, idx) => {
          const y =
            padding +
            chartHeight -
            ((rank - minRank) / rankRange) * chartHeight;
          return (
            <line
              key={idx}
              x1={padding}
              y1={y}
              x2={width - padding}
              y2={y}
              stroke="currentColor"
              strokeWidth="0.5"
              className="text-border-subtle"
            />
          );
        })}

        {/* Line */}
        <path
          d={pathData}
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          className="text-primary"
        />

        {/* Points */}
        {rankHistory.map((rank, index) => {
          const x = padding + (index / (rankHistory.length - 1 || 1)) * chartWidth;
          const y =
            padding +
            chartHeight -
            ((rank - minRank) / rankRange) * chartHeight;
          return (
            <circle
              key={index}
              cx={x}
              cy={y}
              r="3"
              fill="currentColor"
              className="text-primary"
            />
          );
        })}

        {/* Labels */}
        {rankHistory.map((rank, index) => {
          const x = padding + (index / (rankHistory.length - 1 || 1)) * chartWidth;
          const y = height - padding + 12;
          return (
            <text
              key={index}
              x={x}
              y={y}
              textAnchor="middle"
              className="fill-muted text-[10px]"
            >
              {rank}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
