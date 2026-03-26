"use client"

import { use, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { ExamCountdownDisplay } from "@/components/student/exam-countdown-display"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CircleAlert } from "lucide-react"
import { useStudentSession } from "@/hooks/use-student-session"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { exams as legacyExams, type Exam } from "@/lib/mock-data"
import { getStudentExams } from "@/lib/student-exams"

function formatCountdown(seconds: number) {
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  return {
    hours: hours.toString().padStart(2, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: secs.toString().padStart(2, '0'),
  }
}

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

export default function ExamDetailPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = use(params)
  const { studentClass } = useStudentSession()
  const [countdown, setCountdown] = useState(0)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [allExams, setAllExams] = useState<Exam[]>(legacyExams)
  const [error, setError] = useState<string | null>(null)

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
        setError(loadError instanceof Error ? loadError.message : "Failed to load exam.")
      }
    }

    void loadExams()

    return () => {
      isMounted = false
    }
  }, [])

  const exam = useMemo(() => allExams.find(e => e.id === examId), [allExams, examId])
  const schedule = exam?.scheduledClasses.find(sc => sc.classId === studentClass)
  const isTodayExam = schedule?.date === getLocalDateString()

  useEffect(() => {
    if (!schedule || !isTodayExam) return

    const updateCountdown = () => {
      setCountdown(getSecondsUntil(schedule.date, schedule.time))
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [isTodayExam, schedule])

  if (!exam) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">Exam not found</h1>
        <Link href="/student/exams">
          <Button className="mt-4">Back to Exams</Button>
        </Link>
      </div>
    )
  }

  const isReady = isTodayExam && countdown === 0
  const { hours, minutes, seconds } = formatCountdown(countdown)

  const handleTakeExam = () => {
    // In a real app, this would start the exam
    alert('Starting exam... (This would redirect to the actual exam interface)')
  }

  if (isFullscreen) {
    return (
      <div className="fixed inset-0 bg-background z-50 flex flex-col items-center justify-center">
        <button 
          onClick={() => setIsFullscreen(false)}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          Exit Fullscreen
        </button>
        
        <ExamCountdownDisplay
          countdown={{ hours, minutes, seconds }}
          duration={exam.duration}
          isFullscreen
          isReady={isReady}
          onPrimaryAction={handleTakeExam}
          scheduleLabel={`${schedule?.date} at ${schedule?.time}`}
          title={exam.title}
        />
        <div className="text-center text-muted-foreground">
          <p>Questions: {exam.questions.length}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {error ? (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Could not refresh exam details</AlertTitle>
          <AlertDescription>
            {error} Showing the best available exam data for now.
          </AlertDescription>
        </Alert>
      ) : null}

      <div>
        <Link href="/student/exams" className="text-sm text-muted-foreground hover:underline">
          &larr; Back to Exams
        </Link>
        <h1 className="text-2xl font-bold mt-2">{exam.title}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exam Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Date</div>
              <div className="font-medium">{schedule?.date}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Time</div>
              <div className="font-medium">{schedule?.time}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Duration</div>
              <div className="font-medium">{exam.duration} minutes</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Questions</div>
              <div className="font-medium">{exam.questions.length}</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className={isReady ? 'border-primary' : ''}>
        <CardHeader>
          <CardTitle>
            {isTodayExam ? (isReady ? 'Exam is Ready!' : 'Time Until Exam') : 'Scheduled Exam'}
          </CardTitle>
          <CardDescription>
            {isTodayExam
              ? (isReady
                ? 'You can now take the exam'
                : 'The take exam button will be available when the countdown reaches zero')
              : 'Countdown is only shown on the scheduled exam day.'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isTodayExam ? (
            <ExamCountdownDisplay
              countdown={{ hours, minutes, seconds }}
              duration={exam.duration}
              isReady={isReady}
              onFullscreen={() => setIsFullscreen(true)}
              onPrimaryAction={handleTakeExam}
            />
          ) : (
            <div className="space-y-4 text-sm">
              <p className="text-muted-foreground">
                This exam is scheduled for {schedule?.date} at {schedule?.time}.
              </p>
              <Button disabled>Take Exam (Locked)</Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Instructions</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-muted-foreground list-disc list-inside">
            <li>Make sure you have a stable internet connection</li>
            <li>Read each question carefully before answering</li>
            <li>You cannot pause once the exam starts</li>
            <li>The exam will auto-submit when time runs out</li>
            <li>Do not refresh or close the browser during the exam</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
