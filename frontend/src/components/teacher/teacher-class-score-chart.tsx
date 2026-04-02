"use client";

import { CalendarDays, Clock3 } from "lucide-react";
import Image from "next/image";
import { useCurrentTime } from "@/hooks/use-current-time";
import { formatIsoDate, formatTimeLabel } from "@/lib/teacher-dashboard-utils";
import type { ExamResult, Student } from "@/lib/mock-data-types";
import type { TeacherExam } from "@/lib/teacher-exams";

const yAxisLabels = [
  "IX бүлэг",
  "VIII бүлэг",
  "VII бүлэг",
  "VI бүлэг",
  "V бүлэг",
  "IV бүлэг",
  "III бүлэг",
  "II бүлэг",
  "I бүлэг",
];

const xAxisLabels = [
  { points: "1 оноо", range: "1-5" },
  { points: "1 оноо", range: "6-10" },
  { points: "2 оноо", range: "11-15" },
  { points: "2 оноо", range: "16-20" },
  { points: "2 оноо", range: "21-25" },
  { points: "3 оноо", range: "26-30" },
  { points: "3 оноо", range: "31-35" },
  { points: "3 оноо", range: "36-40" },
  { points: "10 оноо", range: "40-41" },
  { points: "10 оноо", range: "42-45" },
];

const chartSeries = [
  {
    color: "#f27fb0",
    points: [
      [0, 6.9],
      [1, 6.5],
      [2, 5.9],
      [3, 5.3],
      [4, 5.4],
      [5, 4.7],
      [6, 4.2],
      [7, 4.0],
      [8, 3.3],
      [9, 3.1],
    ],
  },
  {
    color: "#6fd1e7",
    points: [
      [0, 7.1],
      [1, 6.4],
      [2, 6.1],
      [3, 5.8],
      [4, 5.0],
      [5, 4.5],
      [6, 5.1],
      [7, 5.3],
      [8, 4.6],
      [9, 4.2],
    ],
  },
  {
    color: "#f2b58f",
    points: [
      [0, 6.8],
      [1, 6.2],
      [2, 5.6],
      [3, 5.9],
      [4, 5.5],
      [5, 4.9],
      [6, 4.7],
      [7, 5.2],
      [8, 5.0],
      [9, 4.7],
    ],
  },
] as const;

const highlightBubbles = [
  { bg: "#ffffff", dot: "#f2b58f", text: "6.987", x: 40, y: 38 },
  { bg: "#ffffff", dot: "#f27fb0", text: "7.357", x: 52, y: 10 },
  { bg: "#ffffff", dot: "#6fd1e7", text: "3.43", x: 63, y: 44 },
];

const difficultyRows = [
  { accent: "#77c98a", label: "Хөнгөн", value: "+82%" },
  { accent: "#f4b56f", label: "Дунд", value: "+59%" },
  { accent: "#ef6f76", label: "Хүнд", value: "+32%" },
];

const topicRows = [
  { accent: "#5b8cff", label: "1-р бүлэг 1.1-1.5", value: "+72%" },
  { accent: "#67c7a3", label: "2-р бүлэг 2.5-2.8", value: "+82%" },
  { accent: "#ef8b89", label: "3-р бүлэг 3.4-3.8", value: "+59%" },
];

export function TeacherClassScoreChart({
  exam,
}: {
  exam: TeacherExam | null;
  results: ExamResult[];
  students: Student[];
}) {
  const now = useCurrentTime();
  const currentDateLabel = now ? formatIsoDate(now).replaceAll("-", ".") : "----.--.--";
  const currentTimeLabel = now ? formatTimeLabel(now) : "--:--";

  return (
    <div className="w-full max-w-[900px]">
      <div className="mb-2 pl-[30px]">
        <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-[#5d6378]">
          Шалгалтын чанар
        </h2>
        <div className="mt-2 flex flex-wrap items-center gap-4 text-[11px] font-medium text-[#a7afc5]">
          <span className="inline-flex items-center gap-1.5">
            <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.7} />
            {currentDateLabel}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5" strokeWidth={1.7} />
            Өнөөдөр · {currentTimeLabel}
          </span>
        </div>
      </div>

      <div className="-mt-2">
        <QualityChart />
      </div>

      <div className="mt-6 flex flex-col gap-3 md:flex-row">
        <SummaryCard
          title="Асуултын чанар"
          rows={difficultyRows}
          variant="difficulty"
        />
        <SummaryCard
          title="Сэдвийн гүйцэтгэл"
          rows={topicRows}
          variant="topic"
        />
      </div>
    </div>
  );
}

function QualityChart() {
  const width = 880;
  const height = 423;
  const left = 64;
  const right = 28;
  const top = 18;
  const bottom = 76;
  const chartWidth = width - left - right;
  const chartHeight = height - top - bottom;
  const highlightIndex = 5;
  const focusX =
    left + (chartWidth / (xAxisLabels.length - 1)) * highlightIndex;
  const focusY = top + (chartHeight / (yAxisLabels.length - 1)) * 2.7;

  const buildX = (index: number) =>
    left + (chartWidth / (xAxisLabels.length - 1)) * index;

  const buildY = (value: number) =>
    top + (chartHeight / (yAxisLabels.length - 1)) * value;

  return (
    <div className="relative overflow-hidden rounded-[28px] px-1 py-2">
      <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
        <defs>
          <filter id="seriesGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter
            id="bubbleShadow"
            x="-30%"
            y="-30%"
            width="160%"
            height="160%"
          >
            <feDropShadow
              dx="0"
              dy="6"
              stdDeviation="10"
              floodColor="rgba(155,167,198,0.18)"
            />
          </filter>
          <radialGradient id="focusGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="rgba(255,164,204,0.42)" />
            <stop offset="55%" stopColor="rgba(255,183,210,0.16)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          <linearGradient id="focusColumn" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor="rgba(244,176,212,0)" />
            <stop offset="20%" stopColor="rgba(244,176,212,0.2)" />
            <stop offset="80%" stopColor="rgba(244,176,212,0.14)" />
            <stop offset="100%" stopColor="rgba(244,176,212,0)" />
          </linearGradient>
        </defs>

        <rect
          x={focusX - 30}
          y={top + 8}
          width="60"
          height={chartHeight - 34}
          rx="30"
          fill="url(#focusColumn)"
        />
        <line
          x1={focusX}
          x2={focusX}
          y1={top + 18}
          y2={top + chartHeight - 18}
          stroke="rgba(241,138,186,0.38)"
          strokeWidth="1.2"
        />

        {yAxisLabels.map((label, index) => {
          const y = top + (chartHeight / (yAxisLabels.length - 1)) * index;
          return (
            <text
              key={label}
              x="2"
              y={y + 4}
              className="fill-[#a0a8c2]"
              fontSize="12"
              fontWeight="500"
            >
              {label}
            </text>
          );
        })}

        {chartSeries.map((series) => {
          const path = series.points
            .map(([xValue, yValue], index) => {
              const x = buildX(xValue);
              const y = buildY(yValue);

              if (index === 0) return `M ${x} ${y}`;

              const [prevXValue, prevYValue] = series.points[index - 1];
              const prevX = buildX(prevXValue);
              const prevY = buildY(prevYValue);
              const controlX = prevX + (x - prevX) / 2;
              return `C ${controlX} ${prevY} ${controlX} ${y} ${x} ${y}`;
            })
            .join(" ");

          return (
            <path
              key={series.color}
              d={path}
              fill="none"
              filter="url(#seriesGlow)"
              stroke={series.color}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.65"
            />
          );
        })}

        <circle cx={focusX} cy={focusY} fill="url(#focusGlow)" r="58" />
        <circle cx={focusX} cy={focusY} fill="#ffd9e8" opacity="0.95" r="7.5" />
        <circle cx={focusX} cy={focusY} fill="#ffffff" opacity="0.84" r="3.1" />

        {highlightBubbles.map((bubble) => (
          <g
            key={bubble.text}
            transform={`translate(${bubble.x + focusX - 70}, ${bubble.y + focusY - 86})`}
            filter="url(#bubbleShadow)"
          >
            <rect width="44" height="22" rx="11" fill={bubble.bg} />
            <circle cx="11" cy="11" fill={bubble.dot} r="3" />
            <text
              x="21"
              y="14.2"
              className="fill-[#7f88a7]"
              fontSize="10.5"
              fontWeight="600"
            >
              {bubble.text}
            </text>
          </g>
        ))}

        {xAxisLabels.map((item, index) => {
          const x = buildX(index);
          return (
            <g key={`${item.range}-${item.points}`}>
              <text
                x={x}
                y={height - 26}
                textAnchor="middle"
                className="fill-[#8e98b4]"
                fontSize="11"
                fontWeight="500"
              >
                {item.range}
              </text>
              <text
                x={x}
                y={height - 11}
                textAnchor="middle"
                className="fill-[#afb7cb]"
                fontSize="10.5"
                fontWeight="500"
              >
                {item.points}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function SummaryCard(props: {
  rows: Array<{ accent: string; label: string; value: string }>;
  title: string;
  variant: "difficulty" | "topic";
}) {
  const { rows, title, variant } = props;

  return (
    <div className="flex-1 rounded-[18px] border border-[#edf1fa] bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(249,251,255,0.92)_100%)] px-4 py-3 shadow-[0_12px_32px_rgba(180,196,227,0.12)]">
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-1.5">
            <Image
              src={variant === "difficulty" ? "/certificate.svg" : "/book-open-blue.svg"}
              alt=""
              width={16}
              height={16}
              className="shrink-0"
            />
            <p className="text-[13px] font-semibold text-[#687391]">{title}</p>
          </div>
          <p className="mt-0.5 text-[10px] text-[#a5aec4]">
            {variant === "difficulty"
              ? "Difficulty-based summary"
              : "Chapter-based summary"}
          </p>
        </div>
        <div className="text-[12px] font-semibold text-[#6d85ff]">
          {variant === "difficulty" ? "+32%" : "+72%"}
        </div>
      </div>

      <div className="mt-3 flex items-end justify-between gap-4">
        <div className="min-w-0 flex-1 space-y-1.5">
          {rows.map((row) => (
            <div
              key={row.label}
              className="flex items-center justify-between gap-3 text-[11px]"
            >
              <span className="truncate text-[#6d7690]">{row.label}</span>
              <span
                className="shrink-0 font-semibold"
                style={{ color: row.accent }}
              >
                {row.value}
              </span>
            </div>
          ))}
        </div>
        <MiniSparkline variant={variant} />
      </div>
    </div>
  );
}

function MiniSparkline({ variant }: { variant: "difficulty" | "topic" }) {
  const line =
    variant === "difficulty"
      ? "M 4 26 C 18 14, 28 10, 38 18 C 46 24, 56 29, 66 21 C 75 15, 83 12, 94 17"
      : "M 4 28 C 15 24, 24 19, 33 17 C 43 15, 54 9, 63 12 C 74 15, 83 10, 94 6";

  return (
    <svg viewBox="0 0 98 34" className="h-[32px] w-[96px] shrink-0">
      <path
        d={line}
        fill="none"
        stroke={variant === "difficulty" ? "#d8dde9" : "#cfd7ec"}
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.2"
      />
    </svg>
  );
}
