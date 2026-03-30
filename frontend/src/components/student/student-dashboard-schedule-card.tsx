"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import type { Exam } from "@/lib/mock-data"

const weekdayLabels = ["Ня", "Да", "Мя", "Лх", "Пү", "Ба", "Бя"]

function getWeekDates() {
  const today = new Date()
  const start = new Date(today)
  start.setDate(today.getDate() - today.getDay())

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(start)
    date.setDate(start.getDate() + index)
    return {
      key: date.toISOString().split("T")[0],
      day: weekdayLabels[index],
      date,
      number: date.getDate(),
      isToday: date.toDateString() === today.toDateString(),
    }
  })
}

function getWeekEvents(exams: Exam[], studentClass: string, weekKeys: Set<string>) {
  return exams
    .flatMap((exam) =>
      exam.scheduledClasses
        .filter((schedule) => schedule.classId === studentClass && weekKeys.has(schedule.date))
        .map((schedule) => ({ exam, schedule })),
    )
    .sort((left, right) => `${left.schedule.date}${left.schedule.time}`.localeCompare(`${right.schedule.date}${right.schedule.time}`))
}

export function StudentDashboardScheduleCard({
  exams,
  studentClass,
}: {
  exams: Exam[]
  studentClass: string
}) {
  const weekDates = getWeekDates()
  const weekEvents = getWeekEvents(exams, studentClass, new Set(weekDates.map((entry) => entry.key)))
  const baseDate = weekDates[0]?.date ?? new Date()
  const monthLabel = `${baseDate.getFullYear()} оны ${baseDate.getMonth() + 1}-р сар`

  return (
    <section className="w-full rounded-[16px] bg-[linear-gradient(126.97deg,rgba(6,11,38,0.74)_28.26%,rgba(26,31,55,0.5)_91.2%)] p-5 backdrop-blur-[60px]">
      <h2 className="font-sans text-[16px] font-medium leading-[19px] text-[#E1E6EB]">{monthLabel}</h2>

      <div className="mt-5 grid grid-cols-7 gap-2">
        {weekDates.map((entry) => (
          <div key={entry.key} className="text-center">
            <p className="font-sans text-[14px] font-medium leading-[17px] text-[#89939C]">{entry.day}</p>
            <div
              className={`mt-2 inline-flex h-7 w-7 items-center justify-center rounded-full text-[18px] font-bold leading-[22px] ${
                entry.isToday ? "bg-[#3399FF] text-white" : "text-[#E1E6EB]"
              }`}
            >
              {entry.number}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-[14px] space-y-[14px]">
        {weekEvents.length > 0 ? (
          weekEvents.map(({ exam, schedule }) => (
            <div key={`${exam.id}-${schedule.date}-${schedule.time}`} className="space-y-4">
              <div className="flex items-center gap-[10px]">
                <p className="shrink-0 font-sans text-[12px] font-normal leading-[14px] text-[#3399FF]">
                  {schedule.time} - {String(Number(schedule.time.slice(0, 2)) + Math.ceil(exam.duration / 60)).padStart(2, "0")}:{schedule.time.slice(3, 5)}
                </p>
                <div className="h-px flex-1 border-t border-dashed border-[#CCE5FF]" />
              </div>
              <div className={`flex items-center justify-between gap-4 rounded-[8px] px-3 py-3 backdrop-blur-[60px] ${schedule.date === new Date().toISOString().split("T")[0] ? "bg-[rgba(255,255,255,0.08)]" : "bg-[linear-gradient(126.97deg,#060C29_28.26%,rgba(4,12,48,0.5)_91.2%)]"}`}>
                <p className="font-sans text-[16px] font-medium leading-[19px] text-[#E1E6EB]">{exam.title}</p>
                <Button asChild variant="ghost" className={`h-[44px] rounded-[12px] px-6 text-[14px] font-medium ${schedule.date === new Date().toISOString().split("T")[0] ? "bg-[#007FFF] text-[#E6F2FF] hover:bg-[#0B86FF]" : "bg-[rgba(255,255,255,0.08)] text-[#6F7982] hover:bg-[rgba(255,255,255,0.12)]"}`}>
                  <Link href={`/student/exams/${exam.id}`}>Дэлгэрэнгүй</Link>
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="rounded-[12px] bg-[rgba(255,255,255,0.08)] px-5 py-6 text-[14px] text-[#C2C9D0]">
            Энэ долоо хоногт таны ангид товлогдсон шалгалт алга.
          </div>
        )}
      </div>
    </section>
  )
}
