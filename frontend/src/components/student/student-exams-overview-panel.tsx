"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { Clock3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Exam } from "@/lib/mock-data"

const tabs = [
  { id: "all", label: "Бүгд" },
  { id: "scheduled", label: "Шалгалт" },
  { id: "results", label: "Дүн" },
] as const

const dashboardRecentResults = [
  { id: "cs", subject: "Мэдээлэл зүй", short: "МЗ", score: "98/100", grade: { label: "A", tone: "text-[#E8F5E9] bg-[#62D84E]" } },
  { id: "mn", subject: "Монгол хэл", short: "МХ", score: "85/100", grade: { label: "B+", tone: "text-[#E6F2FF] bg-[#4A8CFF]" } },
  { id: "history", subject: "Түүх", short: "Тү", score: "85/100", grade: { label: "A-", tone: "text-[#E8F5E9] bg-[#62D84E]" } },
  { id: "bio", subject: "Биологи", short: "Би", score: "88/100", grade: { label: "B+", tone: "text-[#E6F2FF] bg-[#4A8CFF]" } },
] as const

export function StudentExamsOverviewPanel({
  exams,
  today,
}: {
  exams: Exam[]
  today: string
}) {
  const [activeTab, setActiveTab] = useState<(typeof tabs)[number]["id"]>("results")
  const scheduledExams = useMemo(() => exams.filter((exam) => exam.status === "scheduled"), [exams])
  const visibleExams = activeTab === "results" ? [] : scheduledExams
  const visibleResults = activeTab === "scheduled" ? [] : dashboardRecentResults

  return (
    <section className="h-auto w-full rounded-[16px] bg-[linear-gradient(126.97deg,rgba(6,11,38,0.74)_28.26%,rgba(26,31,55,0.5)_91.2%)] p-5 backdrop-blur-[60px] xl:sticky xl:top-0 xl:max-h-[calc(100vh-132px)] xl:min-h-[720px] xl:w-[440px] xl:overflow-y-auto">
      <h1 className="font-sans text-[20px] font-medium leading-6 text-[#F0F3F5]">Миний шалгалтууд</h1>
      <p className="mt-[7px] font-sans text-[14px] font-normal leading-5 text-[#C2C9D0]">
        Мэдлэгээ баталгаажуулах мөч ирлээ. Амжилт хүсье!
      </p>

      <div className="mt-5 grid h-11 grid-cols-3 rounded-full border border-[#E6F2FF] bg-[#003366] p-2 shadow-[0px_9px_4px_rgba(201,201,201,0.01),0px_5px_3px_rgba(201,201,201,0.05),0px_2px_2px_rgba(201,201,201,0.09),0px_1px_1px_rgba(201,201,201,0.10)]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`rounded-full px-4 py-1 font-sans text-[14px] font-medium leading-5 ${
              activeTab === tab.id
                ? "bg-[#3D7CFF] text-[#F5FAFF] shadow-[0px_8px_18px_rgba(61,124,255,0.35)]"
                : "text-[#F9FAFB]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="mt-[28px] rounded-[16px] bg-[rgba(255,255,255,0.08)] px-5 py-5 text-[#FFFFFF] backdrop-blur-[60px]">
        <p className="font-sans text-[14px] font-semibold leading-[17px]">
          Мэдэгдэл: 2026.03.13 18:00 цагт Геометрийн шалгалтын дүн системд орно.
        </p>
      </div>

      {visibleExams.length > 0 ? (
        <div className="mt-5">
          <h2 className="font-sans text-[14px] font-semibold leading-5 text-[#C2C9D0]">Удахгүй болох шалгалтууд</h2>
          <div className="mt-5 space-y-4">
            {visibleExams.map((exam) => {
              const schedule = exam.scheduledClasses[0]
              const isToday = schedule?.date === today
              return (
                <article key={exam.id} className={`rounded-[16px] p-[17px] ${isToday ? "bg-[linear-gradient(126.97deg,#060C29_28.26%,rgba(4,12,48,0.5)_91.2%)]" : "bg-[linear-gradient(126.97deg,rgba(6,11,38,0.74)_28.26%,rgba(26,31,55,0.5)_91.2%)]"}`}>
                  <div className="flex items-start justify-between gap-4">
                    <p className="font-sans text-[16px] font-bold leading-6 text-[#F5FAFF]">{exam.title}</p>
                    {isToday ? <span className="rounded-full bg-[#00C853] px-2 py-0.5 text-[12px] font-medium text-[#E8F5E9]">Бэлэн</span> : null}
                  </div>
                  <div className="mt-2 flex items-center gap-3 text-[12px] text-[#C2C9D0]">
                    <Clock3 className="h-[14px] w-[14px]" />
                    <span>{exam.duration} мин</span>
                    <span>{isToday ? `Өнөөдөр · ${schedule?.time}` : `${schedule?.date} · ${schedule?.time}`}</span>
                  </div>
                  <Button asChild variant="ghost" className={`mt-3 h-[44px] w-full rounded-[12px] text-[14px] font-medium ${isToday ? "bg-[#007FFF] text-[#E6F2FF] hover:bg-[#0B86FF]" : "bg-[rgba(255,255,255,0.08)] text-[#6F7982] hover:bg-[rgba(255,255,255,0.12)]"}`}>
                    <Link href={`/student/exams/${exam.id}`}>Дэлгэрэнгүй</Link>
                  </Button>
                </article>
              )
            })}
          </div>
        </div>
      ) : null}

      {visibleResults.length > 0 ? (
        <div className="mt-5">
          <h2 className="font-sans text-[14px] font-semibold leading-5 text-[#C2C9D0]">Сүүлийн дүнгүүд</h2>
          <div className="mt-4 space-y-4">
            {visibleResults.map((result) => {
              return (
                <Link key={result.id} href="/student/reports/e1" className="flex items-center justify-between rounded-[16px] bg-[linear-gradient(126.97deg,#060C29_28.26%,rgba(4,12,48,0.5)_91.2%)] px-3 py-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.05),0_12px_24px_rgba(0,0,0,0.14)] transition hover:bg-[rgba(255,255,255,0.08)]">
                  <div className="flex items-center gap-4">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full border border-[#F0F3F5] bg-transparent text-[12px] text-[#F5FAFF]">
                      {result.short}
                    </div>
                    <div>
                      <p className="font-sans text-[14px] font-medium leading-5 text-[#F5FAFF]">{result.subject}</p>
                      <p className="text-[12px] leading-4 text-[#C2C9D0]">{result.score}</p>
                    </div>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-[14px] font-bold leading-5 ${result.grade.tone}`}>{result.grade.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      ) : null}
    </section>
  )
}
