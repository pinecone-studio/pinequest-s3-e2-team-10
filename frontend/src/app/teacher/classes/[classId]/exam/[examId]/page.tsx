"use client"

import { use, useState } from "react"
import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"
import { TeacherExamAttemptsTable } from "@/components/teacher/teacher-exam-attempts-table"
import { TeacherExamResultsTable } from "@/components/teacher/teacher-exam-results-table"
import { TeacherExamReviewDialog } from "@/components/teacher/teacher-exam-review-dialog"
import { TeacherExamStatsHero } from "@/components/teacher/teacher-exam-stats-hero"
import { TeacherQuestionAnalysisCard } from "@/components/teacher/teacher-question-analysis-card"
import { getClassById, getStudentById } from "@/lib/mock-data-helpers"
import { submitStudentExamResult } from "@/lib/student-exam-results"
import { isManualReviewQuestionType } from "@/lib/student-report-view"
import { useTeacherExamPageData } from "@/hooks/use-teacher-exam-page-data"

function getAnswerPoints(questionPoints: number, awardedPoints: number | null | undefined, isCorrect: boolean | null) {
  if (typeof awardedPoints === "number") return awardedPoints
  return isCorrect ? questionPoints : 0
}

export default function ExamStatsPage({
  params,
}: {
  params: Promise<{ classId: string; examId: string }>
}) {
  const { classId, examId } = use(params)
  const classData = getClassById(classId)
  const [isSaving, setIsSaving] = useState(false)
  const [isReviewDialogOpen, setIsReviewDialogOpen] = useState(false)
  const {
    attempts,
    draftScores,
    exam,
    filteredResults,
    isLoading,
    pendingResults,
    selectedResult,
    selectedStudentId,
    setDraftScores,
    setResults,
    setSelectedStudentId,
  } = useTeacherExamPageData({ classId, examId, classData })

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center gap-3 text-sm text-muted-foreground">
        <Spinner />
        Шалгалтын үнэлгээний хуудсыг ачааллаж байна...
      </div>
    )
  }

  if (!classData || !exam) {
    return (
      <div className="py-12 text-center">
        <h1 className="text-2xl font-bold">Шалгалт олдсонгүй</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Энэ шалгалтын мэдээлэл backend-ээс ирээгүй эсвэл тухайн ангид холбогдоогүй байна.
        </p>
        <Button className="mt-4" onClick={() => history.back()}>Анги руу буцах</Button>
      </div>
    )
  }

  const avgScore = filteredResults.length > 0
    ? Math.round(filteredResults.reduce((sum, result) => sum + (result.score / result.totalPoints) * 100, 0) / filteredResults.length)
    : 0
  const submittedCount = filteredResults.length
  const inProgressCount = attempts.filter(
    (attempt) =>
      attempt.classId === classId &&
      attempt.examId === examId &&
      attempt.status === "in_progress" &&
      !filteredResults.some((result) => result.studentId === attempt.studentId),
  ).length
  const notStartedCount = Math.max(classData.students.length - submittedCount - inProgressCount, 0)
  const questionStats = exam.questions.map((question) => {
    const answers = filteredResults.flatMap((result) =>
      result.answers.filter((answer) => answer.questionId === question.id && answer.answer.trim()),
    )
    const correctCount = answers.filter((answer) => answer.isCorrect).length
    return {
      questionId: question.id,
      question: question.question,
      type: question.type,
      correctCount,
      totalCount: answers.length,
      failRate: answers.length > 0 ? ((answers.length - correctCount) / answers.length) * 100 : 0,
    }
  })

  const selectedStudent = selectedResult ? (getStudentById(selectedResult.studentId) ?? null) : null
  const reviewQuestions = exam.questions
    .filter((question) => isManualReviewQuestionType(question.type))
    .map((question) => ({ question, answer: selectedResult?.answers.find((entry) => entry.questionId === question.id) }))
    .filter((entry) => entry.answer?.answer.trim())

  const handleSelectStudent = (studentId: string) => {
    setSelectedStudentId(studentId)
    setIsReviewDialogOpen(true)
  }

  const handleSaveReview = async () => {
    if (!selectedResult || !selectedStudent) return
    setIsSaving(true)
    try {
      const updatedAnswers = selectedResult.answers.map((answer) => {
        const question = exam.questions.find((entry) => entry.id === answer.questionId)
        if (!question || !isManualReviewQuestionType(question.type) || !answer.answer.trim()) return answer
        const parsedScore = Number(draftScores[question.id])
        const clampedScore = Number.isFinite(parsedScore) ? Math.min(question.points, Math.max(0, parsedScore)) : 0
        return {
          ...answer,
          awardedPoints: clampedScore,
          reviewStatus: "graded" as const,
          isCorrect: clampedScore === question.points ? true : clampedScore === 0 ? false : null,
        }
      })
      const score = exam.questions.reduce((sum, question) => {
        const answer = updatedAnswers.find((entry) => entry.questionId === question.id)
        return sum + getAnswerPoints(question.points, answer?.awardedPoints, answer?.isCorrect ?? null)
      }, 0)
      const savedResult = await submitStudentExamResult({
        examId: exam.id,
        studentId: selectedResult.studentId,
        studentName: selectedStudent.name,
        classId: selectedStudent.classId,
        answers: updatedAnswers,
        score,
        totalPoints: selectedResult.totalPoints,
        submittedAt: selectedResult.submittedAt,
      })
      setResults((current) =>
        current.map((result) =>
          result.examId === savedResult.examId && result.studentId === savedResult.studentId ? savedResult : result,
        ),
      )
      setIsReviewDialogOpen(false)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <TeacherExamStatsHero
        classId={classId}
        classData={classData}
        exam={exam}
        submittedCount={submittedCount}
        inProgressCount={inProgressCount}
        pendingCount={pendingResults.length}
        avgScore={avgScore}
        notStartedCount={notStartedCount}
      />
      <TeacherExamAttemptsTable attempts={attempts} results={filteredResults} classData={classData} selectedStudentId={selectedStudentId} onReview={handleSelectStudent} />
      <TeacherExamResultsTable exam={exam} results={filteredResults} selectedStudentId={selectedStudentId} onReview={handleSelectStudent} />
      <TeacherQuestionAnalysisCard questionStats={questionStats} />
      <TeacherExamReviewDialog
        open={isReviewDialogOpen}
        onOpenChange={setIsReviewDialogOpen}
        className={classData.name}
        exam={exam}
        selectedStudent={selectedStudent}
        selectedResult={selectedResult}
        reviewQuestions={reviewQuestions}
        draftScores={draftScores}
        isSaving={isSaving}
        onScoreChange={(questionId, value) => setDraftScores((current) => ({ ...current, [questionId]: value }))}
        onSave={() => void handleSaveReview()}
      />
    </div>
  )
}
