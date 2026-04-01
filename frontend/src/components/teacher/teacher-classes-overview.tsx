"use client"

import { useEffect, useState } from "react"
import { CalendarDays, Clock3 } from "lucide-react"
import type { Class, ExamResult } from "@/lib/mock-data-types"
import type { TeacherExam } from "@/lib/teacher-exams"
import { buildClassOverviewMetrics, buildExamInsightCards } from "@/lib/teacher-classes-overview"
import { TeacherClassesHeader } from "@/components/teacher/teacher-classes-header"
import { TeacherClassScoreChart } from "@/components/teacher/teacher-class-score-chart"
import { OverviewInsightCard } from "@/components/teacher/teacher-classes-overview-cards"
import { TeacherClassesRosterPanel } from "@/components/teacher/teacher-classes-roster-panel"
import type { TeacherStudentRegistrationInput } from "@/lib/teacher-student-registry"

export function TeacherClassesOverview(props: TeacherClassesOverviewProps) {
  const { classData, classOptions, examResults, onAddStudent, onClassChange, onSemesterChange, selectedExam, selectedExamResults, selectedSemester, semesterOptions, visibleCompletedExams } = props
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000)
    return () => window.clearInterval(timer)
  }, [])

  const metrics = buildClassOverviewMetrics({ classData, exams: visibleCompletedExams, results: examResults })
  const statCards = buildExamInsightCards(selectedExam, selectedExamResults)
  const currentDateLabel = now.toLocaleDateString("mn-MN", { year: "numeric", month: "long", day: "numeric" })
  const currentTimeLabel = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" })

  return (
    <div className="space-y-5">
      <TeacherClassesHeader
        classData={classData}
        classOptions={classOptions}
        currentDateLabel={currentDateLabel}
        metrics={metrics}
        onClassChange={onClassChange}
        onSemesterChange={onSemesterChange}
        selectedSemester={selectedSemester}
        semesterOptions={semesterOptions}
      />

      <section className="grid gap-5 xl:grid-cols-[900px_440px] xl:items-start">
        <div className="flex h-[724px] flex-col rounded-[16px] border border-[#ededed] bg-[linear-gradient(233deg,rgba(255,255,255,0.45)_4.4%,rgba(255,255,255,0.65)_61.8%,rgba(255,255,255,0.54)_119.9%)] px-[18px] pb-[18px] pt-4 shadow-[50px_38px_102px_rgba(120,118,148,0.14)] dark:border-[rgba(224,225,226,0.08)] dark:bg-[linear-gradient(112deg,rgba(6,11,38,0.74)_28%,rgba(26,31,55,0.5)_91%)]">
          <div className="mb-3 w-full max-w-[856px] self-center pl-[40px]">
            <h2 className="text-[20px] font-semibold leading-none text-[#5b5b73] dark:text-[#f0f3f5]">
              Шалгалтын чанар
            </h2>

            <div className="mt-2 flex flex-wrap items-center gap-4 text-xs font-medium text-[#a1acc2] dark:text-[#c2c9d0]">
              <span className="inline-flex items-center gap-1"><CalendarDays className="h-3.5 w-3.5" strokeWidth={1.8} />{currentDateLabel}</span>
              <span className="inline-flex items-center gap-1"><Clock3 className="h-3.5 w-3.5" strokeWidth={1.8} />Өнөөдөр - {currentTimeLabel}</span>
            </div>
          </div>

          <div className="flex min-h-0 flex-1 items-start justify-center">
            <TeacherClassScoreChart exam={selectedExam} results={selectedExamResults} students={classData.students} />
          </div>

          <div className="mt-4 grid h-[108px] w-[864px] grid-cols-3 gap-3 self-center">
            {statCards.map((card) => <OverviewInsightCard key={card.label} card={card} />)}
          </div>
        </div>

        <TeacherClassesRosterPanel classData={classData} date={currentDateLabel} onAddStudent={onAddStudent} time={currentTimeLabel} />
      </section>
    </div>
  )
}

type TeacherClassesOverviewProps = {
  classData: Class
  classOptions: Class[]
  examResults: ExamResult[]
  onAddStudent: (input: TeacherStudentRegistrationInput) => Promise<void>
  onClassChange: (value: string) => void
  onSemesterChange: (value: string) => void
  selectedExam: TeacherExam | null
  selectedExamResults: ExamResult[]
  selectedSemester: string
  semesterOptions: string[]
  visibleCompletedExams: TeacherExam[]
}
