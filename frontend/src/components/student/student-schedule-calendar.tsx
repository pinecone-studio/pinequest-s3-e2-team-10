'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Exam } from '@/lib/mock-data'

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const timeSlots = ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00']

function getWeekDates() {
  const today = new Date()
  const currentDay = today.getDay()
  const monday = new Date(today)
  monday.setDate(today.getDate() - (currentDay === 0 ? 6 : currentDay - 1))

  return daysOfWeek.map((day, index) => {
    const date = new Date(monday)
    date.setDate(monday.getDate() + index)
    return {
      day,
      date: date.toISOString().split('T')[0],
      displayDate: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    }
  })
}

function findExamItem(myExams: Exam[], studentClass: string, date: string, time: string) {
  return myExams.flatMap((exam) =>
    exam.scheduledClasses
      .filter((schedule) => schedule.classId === studentClass && schedule.date === date && schedule.time === time)
      .map((schedule) => ({ exam, schedule })),
  )[0]
}

export function StudentScheduleCalendar({
  myExams,
  studentClass,
}: {
  myExams: Exam[]
  studentClass: string
}) {
  const weekDates = getWeekDates()

  return (
    <Card>
      <CardHeader>
        <CardTitle>Exam Schedule</CardTitle>
        <CardDescription>Your upcoming exams this week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            <div className="grid grid-cols-6 border-b">
              <div className="p-2 font-medium text-muted-foreground">Time</div>
              {weekDates.map(({ day, displayDate }) => (
                <div key={day} className="p-2 text-center border-l">
                  <div className="font-medium">{day}</div>
                  <div className="text-sm text-muted-foreground">{displayDate}</div>
                </div>
              ))}
            </div>

            {timeSlots.map((time) => (
              <div key={time} className="grid grid-cols-6 border-b min-h-[60px]">
                <div className="p-2 text-sm text-muted-foreground">{time}</div>
                {weekDates.map(({ day, date }) => {
                  const examItem = findExamItem(myExams, studentClass, date, time)
                  return (
                    <div key={`${day}-${time}`} className="p-1 border-l min-h-[60px]">
                      {examItem ? (
                        <div className={examItem.exam.status === 'completed' ? 'p-1 rounded text-xs bg-muted' : 'p-1 rounded text-xs bg-destructive/10 border border-destructive/20'}>
                          <div className={examItem.exam.status === 'scheduled' ? 'font-medium text-destructive' : 'font-medium'}>
                            {examItem.exam.title}
                          </div>
                          <div className="text-muted-foreground">{examItem.exam.duration} min</div>
                        </div>
                      ) : null}
                    </div>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
