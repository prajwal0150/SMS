export interface DonutSegment {
  label: string;
  value: number;
  color: string;
}

interface DonutChartProps {
  segments: DonutSegment[];
  centerTop: string;
  centerMain: string;
  centerBottom: string;
}

const DonutChart = ({
  segments,
  centerTop,
  centerMain,
  centerBottom,
}: DonutChartProps) => {
  const total = segments.reduce(
    (sum, segment) => sum + segment.value,
    0
  );

  const parts: string[] = [];
  let cursor = 0;

  segments.forEach((segment) => {
    if (segment.value <= 0) {
      return;
    }

    const start = (cursor / total) * 100;
    cursor += segment.value;
    const end = (cursor / total) * 100;

    parts.push(`${segment.color} ${start}% ${end}%`);
  });

  const gradient = total
    ? `conic-gradient(${parts.join(", ")})`
    : "#e2e8f0";

  return (
    <div
      className="relative h-32 w-32 shrink-0 rounded-full"
      style={{ background: gradient }}
      role="img"
      aria-label={`${centerTop} ${centerMain} ${centerBottom}`}
    >
      <div className="absolute inset-[12px] flex flex-col items-center justify-center rounded-full bg-white text-center">
        <span className="text-xs text-slate-400">{centerTop}</span>
        <span className="text-lg font-bold leading-tight text-slate-900">
          {centerMain}
        </span>
        <span className="text-xs text-slate-400">{centerBottom}</span>
      </div>
    </div>
  );
};

export default DonutChart;