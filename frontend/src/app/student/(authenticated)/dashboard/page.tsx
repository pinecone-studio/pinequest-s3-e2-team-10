"use client"

import { useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { CircleAlert } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { StudentRecentResultsCard } from "@/components/student/student-recent-results-card"
import { StudentScheduleCalendar } from "@/components/student/student-schedule-calendar"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { examResults, exams as legacyExams, type Exam } from "@/lib/mock-data"
import { useStudentSession } from "@/hooks/use-student-session"
import { getStudentExams } from "@/lib/student-exams"

function getSecondsUntil(date: string, time: string) {
  const examDate = new Date(`${date}T${time}:00`)
  const now = new Date()
  const diff = Math.floor((examDate.getTime() - now.getTime()) / 1000)
  return diff > 0 ? diff : 0
}

function getLocalDateString() {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const day = String(now.getDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}

function formatCountdown(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  if (hours > 0) return `${hours}h ${minutes}m ${secs}s`
  if (minutes > 0) return `${minutes}m ${secs}s`
  return `${secs}s`
}

export default function StudentDashboard() {
  const { studentClass, studentId, studentName } = useStudentSession()
  const [allExams, setAllExams] = useState<Exam[]>(legacyExams)
  const [error, setError] = useState<string | null>(null)
  const [todayCountdowns, setTodayCountdowns] = useState<Record<string, number>>({})

  useEffect(() => {
    let isMounted = true

    const loadExams = async () => {
      try {
        const nextExams = await getStudentExams()
        if (!isMounted) return
        setAllExams(nextExams)
        setError(null)
      } catch (loadError) {
        if (!isMounted) return
        setError(loadError instanceof Error ? loadError.message : "Failed to load exams.")
      }
    }

    void loadExams()

    return () => {
      isMounted = false
    }
  }, [])

  const myExams = useMemo(() => allExams.filter(e =>
    e.scheduledClasses.some(sc => sc.classId === studentClass)
  ), [allExams, studentClass])
  const upcomingExams = myExams.filter(e => e.status === 'scheduled')
  const today = getLocalDateString()
  const todaysExams = useMemo(() => upcomingExams.filter((exam) =>
    exam.scheduledClasses.some((schedule) => schedule.classId === studentClass && schedule.date === today)
  ), [studentClass, today, upcomingExams])
  const myResults = examResults.filter(r => r.studentId === studentId)
  const avgScore = myResults.length > 0
    ? Math.round(myResults.reduce((sum, r) => sum + (r.score / r.totalPoints) * 100, 0) / myResults.length)
    : 0

  useEffect(() => {
    const updateCountdowns = () => {
      const nextCountdowns: Record<string, number> = {}
      todaysExams.forEach((exam) => {
        const schedule = exam.scheduledClasses.find((entry) => entry.classId === studentClass)
        if (schedule) {
          nextCountdowns[exam.id] = getSecondsUntil(schedule.date, schedule.time)
        }
      })
      setTodayCountdowns(nextCountdowns)
    }

    updateCountdowns()
    const interval = setInterval(updateCountdowns, 1000)
    return () => clearInterval(interval)
  }, [studentClass, todaysExams])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back, {studentName}</p>
      </div>

      {error ? (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Could not refresh exams</AlertTitle>
          <AlertDescription>
            {error} Showing legacy exam data where available.
          </AlertDescription>
        </Alert>
      ) : null}

      {/* Notifications / Upcoming Exams Alert */}
      {upcomingExams.length > 0 && (
        <Card className="panel-surface border-primary rounded-[1.5rem]">
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              Upcoming Exams
              <Badge>{upcomingExams.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {upcomingExams.map(exam => {
                const schedule = exam.scheduledClasses.find(sc => sc.classId === studentClass)
                const isTodayExam = schedule?.date === today
                const countdown = todayCountdowns[exam.id] ?? 0
                return (
                  <div
                    key={exam.id}
                    className={`elevated-surface flex items-center justify-between rounded-xl border p-3 soft-divider ${isTodayExam ? 'border-primary ring-1 ring-primary/40' : ''}`}
                  >
                    <div>
                      <div className="font-medium">{exam.title}</div>
                      <div className="secondary-text text-sm">
                        {schedule?.date} at {schedule?.time} ({exam.duration} min)
                      </div>
                      {isTodayExam ? (
                        <div className="mt-2 inline-flex items-center rounded-full bg-primary px-3 py-1 text-sm font-semibold text-primary-foreground">
                          {countdown === 0 ? "Ready to start now" : `Starts in ${formatCountdown(countdown)}`}
                        </div>
                      ) : null}
                    </div>
                    <Link href={`/student/exams/${exam.id}`}>
                      <Button size="sm" variant="outline">View</Button>
                    </Link>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="panel-surface rounded-[1.5rem]">
          <CardHeader className="pb-2">
            <CardDescription className="secondary-text">Your Class</CardDescription>
            <CardTitle className="text-3xl">{studentClass}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="panel-surface rounded-[1.5rem]">
          <CardHeader className="pb-2">
            <CardDescription className="secondary-text">Upcoming Exams</CardDescription>
            <CardTitle className="text-3xl">{upcomingExams.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="panel-surface rounded-[1.5rem]">
          <CardHeader className="pb-2">
            <CardDescription className="secondary-text">Completed Exams</CardDescription>
            <CardTitle className="text-3xl">{myResults.length}</CardTitle>
          </CardHeader>
        </Card>
        <Card className="panel-surface rounded-[1.5rem]">
          <CardHeader className="pb-2">
            <CardDescription className="secondary-text">Average Score</CardDescription>
            <CardTitle className="text-3xl">{avgScore}%</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <StudentScheduleCalendar myExams={myExams} studentClass={studentClass} />
      <StudentRecentResultsCard exams={allExams} results={myResults} />
    </div>
  )
}
