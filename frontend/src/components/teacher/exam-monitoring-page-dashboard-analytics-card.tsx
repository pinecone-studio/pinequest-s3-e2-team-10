"use client";

import { cn } from "@/lib/utils";
import { CardHeaderBlock } from "./exam-monitoring-page-dashboard-layout";
import type { MetadataItem, StudentListItem, SummaryStatItem } from "./exam-monitoring-page-dashboard-types";

const panelClassName =
  "rounded-[30px] border border-[#D9E9FA] bg-white/92 p-5 shadow-[0_18px_44px_rgba(205,220,241,0.34)] dark:border-[rgba(82,146,237,0.24)] dark:bg-[#161F4F] dark:[background-image:linear-gradient(126.97deg,rgba(6,11,38,0.74)_28.26%,rgba(26,31,55,0.5)_91.2%)] dark:shadow-[inset_0_0_0_1px_rgba(82,146,237,0.06),0_24px_64px_rgba(2,6,23,0.38)] sm:p-6";

export function AnalyticsCard({ chartData, highlightRange, metadataItems, series, summaryStats, title }: { chartData: ChartDatum[]; highlightRange?: { end: number; start: number }; metadataItems: MetadataItem[]; series: ChartSeries[]; summaryStats: SummaryStatItem[]; title: string; }) {
  return (
    <section className={panelClassName}>
      <CardHeaderBlock metadataItems={metadataItems} title={title} />
      <div className="mt-5"><StudentProgressBoard examQuestionCount={examQuestionCount} students={students} /></div>
      <div className="mt-5"><SummaryStatsRow items={summaryStats} /></div>
    </section>
  );
}

function StudentProgressBoard({ examQuestionCount, students }: { examQuestionCount: number; students: StudentListItem[] }) {
  return (
    <div className="rounded-[28px] bg-[radial-gradient(circle_at_50%_34%,rgba(250,240,255,0.95),rgba(255,255,255,0)_30%),linear-gradient(180deg,#fffdfa_0%,#ffffff_100%)] p-3 sm:p-5">
      <div className="max-h-[420px] space-y-3 overflow-y-auto pr-1">
        {students.map((student) => {
          const progressMatch = student.tertiaryInfo?.match(/(\d+)\/(\d+)/);
          const completedQuestions = progressMatch
            ? Number.parseInt(progressMatch[1] ?? "0", 10)
            : 0;
          const percent =
            examQuestionCount > 0
              ? Math.round((completedQuestions / examQuestionCount) * 100)
              : 0;

          return (
            <div
              key={student.id}
              className="rounded-[22px] border border-[#edf2fa] bg-white/90 px-4 py-4"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-[#44506c]">
                    {student.fullName}
                  </p>
                  <p className="mt-1 text-xs text-[#7f8ba4]">
                    {student.secondaryInfo}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-[#31415f]">
                    {percent}%
                  </p>
                  <p className="text-xs text-[#8d99b0]">{student.trailingMeta}</p>
                </div>
              </div>
              <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-[#eaf0f8]">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#4f8cff_0%,#18c6b7_100%)] transition-all"
                  style={{ width: `${Math.max(percent, completedQuestions > 0 ? 6 : 0)}%` }}
                />
              </div>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs text-[#73809b]">
                <span>{student.tertiaryInfo}</span>
                <span className="rounded-full bg-white px-2.5 py-1 text-[#8c98ad]">
                  {student.badges?.[0] ?? "Хяналт хэвийн"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SummaryStatsRow({ items }: { items: SummaryStatItem[] }) {
  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      {items.map(({ key, ...item }) => (
        <StatMiniCard key={key} {...item} />
      ))}
    </div>
  );
}

function StatMiniCard({ delta, deltaTone = "neutral", icon: Icon, label, sparklineData, value }: SummaryStatItem) {
  const deltaClassName = deltaTone === "positive" ? "text-emerald-600 dark:text-[#7CE5A6]" : deltaTone === "warning" ? "text-amber-600 dark:text-[#F9D071]" : deltaTone === "danger" ? "text-rose-600 dark:text-[#FF9AA2]" : "text-[#8f9bb3] dark:text-[#8FA0BC]";
  return (
    <div className="rounded-[24px] border border-[#edf2fa] bg-[#fcfdff] p-4 shadow-[0_12px_28px_rgba(208,221,241,0.24)] dark:border-[rgba(224,225,226,0.08)] dark:bg-[#0F123B] dark:[background-image:linear-gradient(126.97deg,#060C29_28.26%,rgba(4,12,48,0.5)_91.2%)]">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-1"><p className="text-sm text-[#7f8aa2] dark:text-[#9EACC3]">{label}</p><div className="flex items-baseline gap-2"><p className="text-[1.45rem] font-semibold tracking-[-0.03em] text-[#3e4764] dark:text-[#EDF4FF]">{value}</p>{delta ? <span className={cn("text-xs font-medium", deltaClassName)}>{delta}</span> : null}</div></div>
        {Icon ? <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#7b87a7] shadow-[0_10px_20px_rgba(218,229,243,0.55)] dark:bg-[#11183C] dark:text-[#C7D2E5] dark:shadow-[0_12px_24px_rgba(2,6,23,0.36)]"><Icon className="h-4.5 w-4.5" /></div> : null}
      </div>
      {sparklineData?.length ? <Sparkline data={sparklineData} className="mt-4" /> : null}
    </div>
  );
}

function Sparkline({ className, data }: { className?: string; data: number[] }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = Math.max(max - min, 1);
  const points = data.map((item, index) => `${(index / Math.max(data.length - 1, 1)) * 100},${100 - ((item - min) / range) * 100}`).join(" ");
  return <svg viewBox="0 0 100 40" className={cn("h-9 w-full", className)} preserveAspectRatio="none"><polyline fill="none" stroke="#d7dee8" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" points={points} /></svg>;
}

function ExamProgressTooltip({ active, label, payload }: { active?: boolean; label?: string; payload?: Array<{ color?: string; name?: string; value?: number }>; }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-[20px] border border-[#ecf1f8] bg-white/96 px-4 py-3 shadow-[0_16px_36px_rgba(189,208,235,0.38)] dark:border-[rgba(224,225,226,0.08)] dark:bg-[#11183C]/95 dark:shadow-[0_18px_42px_rgba(2,6,23,0.45)]">
      <p className="text-sm font-semibold text-[#485470] dark:text-[#EDF4FF]">{label}-р хэсэг</p>
      <div className="mt-2 space-y-1.5">{payload.map((item) => <div key={item.name} className="flex items-center justify-between gap-3 text-sm"><div className="inline-flex items-center gap-2 text-[#75819a] dark:text-[#9EACC3]"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color ?? "#cbd5e1" }} />{getChartLabel(item.name)}</div><span className="font-medium text-[#35415b] dark:text-[#EDF4FF]">{item.value ?? 0}%</span></div>)}</div>
    </div>
  );
}

function findRangeLabel(data: ChartDatum[], question: number) {
  return data.find((item) => item.rangeStart <= question && item.rangeEnd >= question)?.label;
}

function getChartLabel(value?: string) {
  return value ? { completionRate: "Ахиц", activeFocus: "Идэвх", submissionRate: "Илгээлт", warningRate: "Эрсдэл" }[value] ?? value : "";
}
