export interface TrendPoint {
  label: string;
  value: number;
}

interface TrendChartProps {
  points: TrendPoint[];
}

const WIDTH = 340;
const HEIGHT = 170;
const PADDING = { top: 18, right: 10, bottom: 24, left: 30 };

const TrendChart = ({ points }: TrendChartProps) => {
  const innerWidth = WIDTH - PADDING.left - PADDING.right;
  const innerHeight = HEIGHT - PADDING.top - PADDING.bottom;

  const toX = (index: number) =>
    points.length <= 1
      ? PADDING.left + innerWidth / 2
      : PADDING.left + (index / (points.length - 1)) * innerWidth;

  const toY = (value: number) =>
    PADDING.top +
    (1 - Math.min(Math.max(value, 0), 100) / 100) * innerHeight;

  const baseline = PADDING.top + innerHeight;

  const linePath = points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"} ${toX(index).toFixed(1)} ${toY(
          point.value
        ).toFixed(1)}`
    )
    .join(" ");

  const areaPath = points.length
    ? `${linePath} L ${toX(points.length - 1).toFixed(1)} ${baseline.toFixed(
        1
      )} L ${toX(0).toFixed(1)} ${baseline.toFixed(1)} Z`
    : "";

  return (
    <svg
      viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
      className="h-44 w-full"
      role="img"
      aria-label="Weekly attendance trend"
    >
      <defs>
        <linearGradient
          id="studentTrendFill"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop offset="0%" stopColor="#6366f1" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
        </linearGradient>
      </defs>

      {[0, 20, 40, 60, 80, 100].map((tick) => (
        <g key={tick}>
          <line
            x1={PADDING.left}
            x2={WIDTH - PADDING.right}
            y1={toY(tick)}
            y2={toY(tick)}
            stroke="#e2e8f0"
            strokeWidth="1"
          />
          <text
            x={PADDING.left - 6}
            y={toY(tick) + 3}
            textAnchor="end"
            fontSize="9"
            fill="#94a3b8"
          >
            {tick}%
          </text>
        </g>
      ))}

      {points.length > 0 && (
        <path d={areaPath} fill="url(#studentTrendFill)" />
      )}

      {points.length > 0 && (
        <path
          d={linePath}
          fill="none"
          stroke="#6366f1"
          strokeWidth="2"
          strokeLinejoin="round"
          strokeLinecap="round"
        />
      )}

      {points.map((point, index) => (
        <g key={`${point.label}-${index}`}>
          <circle
            cx={toX(index)}
            cy={toY(point.value)}
            r="3.5"
            fill="#ffffff"
            stroke="#6366f1"
            strokeWidth="2"
          />
          <text
            x={toX(index)}
            y={toY(point.value) - 8}
            textAnchor="middle"
            fontSize="9"
            fontWeight="600"
            fill="#475569"
          >
            {Math.round(point.value)}%
          </text>
          <text
            x={toX(index)}
            y={HEIGHT - 8}
            textAnchor="middle"
            fontSize="9"
            fill="#94a3b8"
          >
            {point.label}
          </text>
        </g>
      ))}
    </svg>
  );
};

export default TrendChart;