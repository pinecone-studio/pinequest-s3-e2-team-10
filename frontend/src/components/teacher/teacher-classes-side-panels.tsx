"use client"

import { CalendarDays, Clock3, FileText } from "lucide-react"
import type { Class } from "@/lib/mock-data-types"
import {
  buildMockStudentExamResults,
  mockClassAverageData,
  type ClassAveragePoint,
  type StudentExamResult,
} from "@/lib/teacher-classes-side-panel-data"

export function TeacherClassesSidePanels(props: {
  classData: Class
  date: string
  time: string
}) {
  const { classData, date, time } = props
  const studentResults = buildMockStudentExamResults({
    className: classData.name,
    students: classData.students,
  })

  return (
    <div className="flex h-[724px] w-[440px] flex-col gap-5">
      <ScoreInsightCard averages={mockClassAverageData} />
      <StudentResultsCard
        className={classData.name}
        date={date}
        results={studentResults}
        time={time}
      />
    </div>
  )
}

function ScoreInsightCard(props: { averages: ClassAveragePoint[] }) {
  const { averages } = props

  return (
    <section className="rounded-[24px] border border-[rgba(232,238,250,0.95)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(249,251,255,0.94)_100%)] px-5 pb-4 pt-4 shadow-[0_18px_48px_rgba(188,201,229,0.18)]">
      <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-[#5e647c]">
        Дүнгийн мэдээлэл
      </h2>
      <p className="mt-1 text-[13px] text-[#8a96b2]">
        Сурагчдын дундаж үнэлгээ.
      </p>

      <div className="mt-4 rounded-[20px] border border-[#eef3fb] bg-[linear-gradient(180deg,rgba(255,255,255,0.84)_0%,rgba(251,252,255,0.96)_100%)] p-3">
        <CompactAverageChart averages={averages} />
      </div>
    </section>
  )
}

function CompactAverageChart(props: { averages: ClassAveragePoint[] }) {
  const { averages } = props
  const width = 340
  const height = 190
  const left = 28
  const right = 14
  const top = 16
  const bottom = 28
  const chartWidth = width - left - right
  const chartHeight = height - top - bottom

  const buildX = (index: number) =>
    left + (chartWidth / Math.max(averages.length - 1, 1)) * index
  const buildY = (value: number) =>
    top + chartHeight - (value / 100) * chartHeight

  const helperSeries = [
    { color: "#f3b2d2", offset: -6 },
    { color: "#78d9e9", offset: 0 },
    { color: "#f3c6a5", offset: 7 },
  ] as const

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="h-auto w-full">
      {([100, 80, 60, 40, 20] as const).map((tick, index) => (
        <text
          key={tick}
          x="0"
          y={top + (chartHeight / 4) * index + 4}
          className="fill-[#a8b3c8]"
          fontSize="10"
          fontWeight="500"
        >
          {tick}
        </text>
      ))}

      {helperSeries.map((series) => {
        const path = averages
          .map((point, index) => {
            const x = buildX(index)
            const y = buildY(
              Math.max(24, Math.min(96, point.averageScore + series.offset)),
            )

            if (index === 0) return `M ${x} ${y}`

            const prevX = buildX(index - 1)
            const prevY = buildY(
              Math.max(
                24,
                Math.min(96, averages[index - 1]!.averageScore + series.offset),
              ),
            )
            const controlX = prevX + (x - prevX) / 2
            return `C ${controlX} ${prevY} ${controlX} ${y} ${x} ${y}`
          })
          .join(" ")

        return (
          <path
            key={series.color}
            d={path}
            fill="none"
            stroke={series.color}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.4"
          />
        )
      })}

      {averages.map((point, index) => {
        const x = buildX(index)
        return (
          <text
            key={point.className}
            x={x}
            y={height - 4}
            textAnchor="middle"
            className="fill-[#95a2bd]"
            fontSize="10.5"
            fontWeight="500"
          >
            {point.className}
          </text>
        )
      })}

      {averages.slice(0, 2).map((point, index) => {
        const x = buildX(index + 1)
        const y = buildY(point.averageScore - 4)
        return (
          <g key={`${point.className}-label`} transform={`translate(${x - 18}, ${y - 16})`}>
            <rect
              width="40"
              height="18"
              rx="9"
              fill="rgba(255,255,255,0.98)"
              stroke="#f3f5fb"
            />
            <text
              x="20"
              y="12"
              textAnchor="middle"
              className="fill-[#8a96b2]"
              fontSize="9.5"
              fontWeight="600"
            >
              85.56%
            </text>
          </g>
        )
      })}
    </svg>
  )
}

function StudentResultsCard(props: {
  className: string
  date: string
  results: StudentExamResult[]
  time: string
}) {
  const { className, date, results, time } = props

  return (
    <section className="flex min-h-0 flex-1 flex-col rounded-[24px] border border-[rgba(232,238,250,0.95)] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(249,251,255,0.94)_100%)] px-5 pb-4 pt-4 shadow-[0_18px_48px_rgba(188,201,229,0.18)]">
      <h2 className="text-[17px] font-semibold tracking-[-0.02em] text-[#5e647c]">
        Шалгалтын дүн
      </h2>
      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] font-medium text-[#a6b0c5]">
        <span className="inline-flex items-center gap-1">
          <CalendarDays className="h-3.5 w-3.5" strokeWidth={1.8} />
          {date}
        </span>
        <span className="inline-flex items-center gap-1">
          <Clock3 className="h-3.5 w-3.5" strokeWidth={1.8} />
          Өнөөдөр · {time}
        </span>
        <span className="inline-flex items-center gap-1">
          <FileText className="h-3.5 w-3.5" strokeWidth={1.8} />
          Явцын шалгалт
        </span>
      </div>

      <p className="mt-4 text-[15px] font-medium text-[#6b77a4]">
        {className} сурагчдын шалгалтын дүн
      </p>

      <div className="mt-4 flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-1">
        {results.map((result) => (
          <StudentResultRow key={result.studentId} result={result} />
        ))}
      </div>
    </section>
  )
}

function StudentResultRow(props: { result: StudentExamResult }) {
  const { result } = props

  return (
    <div className="grid grid-cols-[46px_minmax(0,1fr)_10px] items-center gap-3 rounded-[16px] border border-[#edf1fa] bg-[linear-gradient(180deg,rgba(255,255,255,0.98)_0%,rgba(251,252,255,0.94)_100%)] px-3 py-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-full border text-[13px] font-semibold" style={buildScoreBadgeStyles(result.scorePercent)}>
        {result.scorePercent}%
      </div>
      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5">
          <p className="truncate text-[13px] font-semibold text-[#4d5671]">
            {result.studentName}
          </p>
          <p className="text-[11px] text-[#8f9ab6]">ID: {result.studentId}</p>
        </div>
        <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[10.5px] text-[#a1acc2]">
          <span>{result.className}</span>
          <span>{result.email}</span>
        </div>
      </div>
      <div className="h-1.5 w-1.5 rounded-full bg-[#d8dfee]" />
    </div>
  )
}

function buildScoreBadgeStyles(scorePercent: number) {
  if (scorePercent >= 90) {
    return {
      backgroundColor: "rgba(231,250,237,0.96)",
      borderColor: "#aee3bf",
      color: "#64c583",
    }
  }

  if (scorePercent >= 75) {
    return {
      backgroundColor: "rgba(238,245,255,0.98)",
      borderColor: "#b9d0ff",
      color: "#6a8fff",
    }
  }

  return {
    backgroundColor: "rgba(246,239,255,0.98)",
    borderColor: "#d3c0ff",
    color: "#a276ff",
  }
}
