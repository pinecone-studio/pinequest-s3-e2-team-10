'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { exams, type ExamResult } from '@/lib/mock-data'

export function StudentRecentResultsCard({
  results,
}: {
  results: ExamResult[]
}) {
  if (results.length === 0) {
    return null
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Results</CardTitle>
        <CardDescription>Your exam scores</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {results.map((result) => {
            const exam = exams.find((entry) => entry.id === result.examId)
            const percentage = Math.round((result.score / result.totalPoints) * 100)
            const badgeVariant =
              percentage >= 70 ? 'default' : percentage >= 50 ? 'secondary' : 'destructive'

            return (
              <div key={`${result.examId}-${result.studentId}`} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <div className="font-medium">{exam?.title}</div>
                  <div className="text-sm text-muted-foreground">
                    Submitted: {new Date(result.submittedAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-right">
                  <Badge variant={badgeVariant}>{percentage}%</Badge>
                  <div className="text-sm text-muted-foreground">
                    {result.score}/{result.totalPoints}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
