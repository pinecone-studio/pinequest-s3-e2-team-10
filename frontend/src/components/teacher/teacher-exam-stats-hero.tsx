"use client"

import Link from "next/link"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import type { Class } from "@/lib/mock-data"
import type { TeacherExam } from "@/lib/teacher-exams"

export function TeacherExamStatsHero(props: {
  classId: string
  classData: Class
  exam: TeacherExam
  submittedCount: number
  inProgressCount: number
  pendingCount: number
  avgScore: number
  notStartedCount: number
}) {
  const { classId, classData, exam, submittedCount, inProgressCount, pendingCount, avgScore, notStartedCount } = props

  return (
    <>
      <div className="rounded-[1.75rem] border border-sky-200 bg-[linear-gradient(135deg,#eff8ff_0%,#ffffff_100%)] p-6 shadow-sm">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="space-y-3">
            <Link href={`/teacher/classes/${classId}`} className="text-sm text-muted-foreground hover:underline">
              &larr; {classData.name} руу буцах
            </Link>
            <div>
              <h1 className="text-3xl font-bold text-slate-900">{exam.title}</h1>
              <p className="mt-2 text-sm leading-6 text-slate-600">
                {classData.name}-ийн шалгалтын явц, илгээсэн сурагчид, хүлээгдэж буй гар үнэлгээ бүгд энэ хуудсан дээр байна.
              </p>
            </div>
          </div>
          <div className="grid min-w-[280px] gap-3 sm:grid-cols-3">
            <MetricCard label="Илгээсэн" value={submittedCount} />
            <MetricCard label="Өгч байна" value={inProgressCount} />
            <MetricCard label="Хүлээгдэж буй" value={pendingCount} />
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <StatCard label="Анги" value={classData.name} />
        <StatCard label="Сурагчдын тоо" value={classData.students.length} />
        <StatCard label="Дундаж оноо" value={`${avgScore}%`} />
        <StatCard label="Эхлээгүй" value={notStartedCount} />
      </div>
    </>
  )
}

function MetricCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/80 bg-white/90 p-4">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="mt-2 text-3xl font-bold text-slate-900">{value}</div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="rounded-[1.5rem] border-slate-200 shadow-sm">
      <CardHeader className="pb-2">
        <CardDescription>{label}</CardDescription>
        <CardTitle className="text-2xl">{value}</CardTitle>
      </CardHeader>
    </Card>
  )
}
