"use client"

import { useEffect, useState } from "react"
import {
  StudentCompletedExamsSection,
  StudentTodayExamsSection,
  StudentUpcomingExamsSection,
} from "@/components/student/student-exams-sections"
import { useStudentSession } from "@/hooks/use-student-session"
import { exams, examResults } from "@/lib/mock-data"

function getSecondsUntil(date: string, time: string) {
  const examDate = new Date(`${date}T${time}:00`)
  const now = new Date()
  const diff = Math.floor((examDate.getTime() - now.getTime()) / 1000)
  return diff > 0 ? diff : 0
}

export default function StudentExamsPage() {
  const { studentClass, studentId } = useStudentSession()
  const [countdowns, setCountdowns] = useState<Record<string, number>>({})

  const myExams = exams.filter(e => 
    e.scheduledClasses.some(sc => sc.classId === studentClass)
  )
  
  const scheduledExams = myExams.filter(e => e.status === 'scheduled')
  const today = new Date().toISOString().split('T')[0]
  const todaysExams = scheduledExams.filter(e => 
    e.scheduledClasses.some(sc => sc.classId === studentClass && sc.date === today)
  )

  useEffect(() => {
    const updateCountdowns = () => {
      const newCountdowns: Record<string, number> = {}
      todaysExams.forEach(exam => {
        const schedule = exam.scheduledClasses.find(sc => sc.classId === studentClass)
        if (schedule) {
          newCountdowns[exam.id] = getSecondsUntil(schedule.date, schedule.time)
        }
      })
      setCountdowns(newCountdowns)
    }

    updateCountdowns()
    const interval = setInterval(updateCountdowns, 1000)
    return () => clearInterval(interval)
  }, [todaysExams, studentClass])

  const myResults = examResults.filter(r => r.studentId === studentId)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Exams</h1>
        <p className="text-muted-foreground">View your upcoming and completed exams</p>
      </div>

      <StudentTodayExamsSection examsToday={todaysExams} studentClass={studentClass} countdowns={countdowns} />
      <StudentUpcomingExamsSection upcomingExams={scheduledExams} todaysExams={todaysExams} studentClass={studentClass} />
      <StudentCompletedExamsSection results={myResults} />
    </div>
  )
}
