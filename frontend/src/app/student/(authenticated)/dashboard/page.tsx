"use client"

import { useEffect, useMemo, useState } from "react"
import { CalendarDays, Medal, Trophy } from "lucide-react"
import { StudentDashboardProfileCard } from "@/components/student/student-dashboard-profile-card"
import { StudentDashboardScheduleCard } from "@/components/student/student-dashboard-schedule-card"
import { StudentExamsOverviewPanel } from "@/components/student/student-exams-overview-panel"
import { useStudentSession } from "@/hooks/use-student-session"
import { exams as legacyExams, type Exam } from "@/lib/mock-data"
import { getLocalDateString } from "@/lib/student-exam-time"
import { getStudentExams } from "@/lib/student-exams"

export default function StudentDashboard() {
  const { studentClass, studentName } = useStudentSession()
  const [allExams, setAllExams] = useState<Exam[]>(legacyExams)

  useEffect(() => {
    let isMounted = true

    const loadExams = async () => {
      try {
        const nextExams = await getStudentExams()
        if (isMounted) setAllExams(nextExams)
      } catch (error) {
        if (isMounted) console.warn("Failed to refresh dashboard exams from the backend.", error)
      }
    }

    void loadExams()
    return () => {
      isMounted = false
    }
  }, [])

  const myExams = useMemo(
    () => allExams.filter((exam) =>
      exam.scheduledClasses.some((schedule) => schedule.classId === studentClass),
    ),
    [allExams, studentClass],
  )

  return (
    <div className="flex min-h-[calc(100vh-82px)] flex-col gap-6 px-5 pb-6 pt-2 sm:px-6 lg:gap-[30px] lg:px-10 lg:pb-[30px] lg:pt-[10px]">
      <div className="flex flex-col gap-5 xl:flex-row xl:items-start xl:justify-between">
        <div className="min-w-0">
          <h1 className="font-sans text-[32px] font-medium leading-8 tracking-[-0.02em] text-[#F9FAFB]">
            Сайн уу, {studentName}!
          </h1>
          <p className="mt-[6px] font-sans text-[16px] font-normal leading-5 text-[#C2C9D0]">
            Өнөөдөр чиний гялалзах өдөр ✨
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 xl:flex xl:items-start xl:gap-10">
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-[linear-gradient(126.97deg,rgba(6,11,38,0.74)_28.26%,rgba(26,31,55,0.5)_91.2%)] text-white backdrop-blur-[60px]">
              <Trophy className="h-7 w-7" />
            </div>
            <div>
              <p className="text-[14px] text-[#C2C9D0]">Нийт амжилт</p>
              <div className="mt-1 flex items-end gap-1">
                <p className="text-[24px] font-semibold leading-[1] tracking-[-0.03em] text-[#F0F3F5]">92.4%</p>
                <p className="bg-[linear-gradient(49.24deg,#339CFE_16.29%,#62CBFF_70.59%)] bg-clip-text text-[12px] font-medium text-transparent">+1.2%</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-[linear-gradient(126.97deg,rgba(6,11,38,0.74)_28.26%,rgba(26,31,55,0.5)_91.2%)] text-white backdrop-blur-[60px]">
              <Medal className="h-7 w-7" />
            </div>
            <div>
              <p className="text-[14px] text-[#C2C9D0]">Мэдээлэл зүй</p>
              <div className="mt-1 flex items-end gap-1">
                <p className="text-[24px] font-semibold leading-[1] tracking-[-0.03em] text-[#F0F3F5]">98 A</p>
                <p className="bg-[linear-gradient(49.24deg,#339CFE_16.29%,#62CBFF_70.59%)] bg-clip-text text-[12px] font-medium text-transparent">Сүүлийн дүн</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-[16px] bg-[linear-gradient(126.97deg,rgba(6,11,38,0.74)_28.26%,rgba(26,31,55,0.5)_91.2%)] text-white backdrop-blur-[60px]">
              <CalendarDays className="h-7 w-7" />
            </div>
            <div>
              <p className="text-[14px] text-[#C2C9D0]">Энэ 7 хоногт</p>
              <div className="mt-1 flex items-end gap-1">
                <p className="text-[24px] font-semibold leading-[1] tracking-[-0.03em] text-[#F0F3F5]">3</p>
                <p className="bg-[linear-gradient(49.24deg,#339CFE_16.29%,#62CBFF_70.59%)] bg-clip-text text-[12px] font-medium text-transparent">Өгөх шалгалт</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid flex-1 gap-5 xl:grid-cols-[minmax(0,1fr)_360px] 2xl:grid-cols-[minmax(0,1fr)_440px]">
        <div className="space-y-5">
          <StudentDashboardProfileCard studentName={studentName} />
          <StudentDashboardScheduleCard exams={myExams} studentClass={studentClass} />
        </div>

        <StudentExamsOverviewPanel exams={myExams} today={getLocalDateString()} />
      </div>
    </div>
  )
}
