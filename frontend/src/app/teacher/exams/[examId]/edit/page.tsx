"use client"

import * as React from "react"
import Link from "next/link"
import { use, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { CircleAlert, Trash2 } from "lucide-react"
import { AIQuestionGeneratorDialog } from "@/components/teacher/ai-question-generator-dialog"
import { ExamBuilderQuestionList } from "@/components/teacher/exam-builder-question-list"
import { ExamBuilderSummaryCard } from "@/components/teacher/exam-builder-summary-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { useExamCreation } from "@/hooks/use-exam-creation"
import { useExamBuilder } from "@/hooks/use-exam-builder"
import { deleteExam, getExam } from "@/lib/exams-api"
import { toast } from "@/hooks/use-toast"

export default function EditExamPage({ params }: { params: Promise<{ examId: string }> }) {
  const { examId } = use(params)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const {
    addQuestion,
    addScheduleEntry,
    aiMCCount,
    aiShortCount,
    aiTFCount,
    addAiSourceFiles,
    duration,
    examTitle,
    generateAIQuestions,
    isGenerating,
    isAiSourceDragging,
    questions,
    reportReleaseMode,
    removeQuestion,
    removeAiSourceFile,
    removeScheduleEntry,
    scheduleEntries,
    selectedAiSourceFiles,
    selectedMockTests,
    setAiMCCount,
    setAiShortCount,
    setAiTFCount,
    setDuration,
    setExamTitle,
    setIsAiSourceDragging,
    setQuestions,
    setReportReleaseMode,
    setScheduleEntries,
    setSelectedMockTests,
    setShowAIDialog,
    showAIDialog,
    updateOption,
    updateQuestion,
    updateScheduleEntry,
  } = useExamBuilder()

  useEffect(() => {
    let isMounted = true

    const loadExam = async () => {
      try {
        const exam = await getExam(examId)
        if (!isMounted) return

        setExamTitle(exam.title)
        setDuration(exam.durationMinutes)
        setReportReleaseMode(exam.reportReleaseMode)
        setQuestions(
          exam.questions.map((question) => ({
            id: question.id,
            type: question.type,
            question: question.question,
            options: question.options,
            correctAnswer: question.correctAnswer ?? "",
            points: question.points,
          })),
        )
        setScheduleEntries(
          exam.schedules.map((schedule) => ({
            classId: schedule.classId,
            date: schedule.date,
            time: schedule.time,
          })),
        )
        setLoadError(null)
      } catch (error) {
        if (!isMounted) return
        setLoadError(error instanceof Error ? error.message : "Failed to load exam.")
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    void loadExam()

    return () => {
      isMounted = false
    }
  }, [examId, setDuration, setExamTitle, setQuestions, setReportReleaseMode, setScheduleEntries])

  const { canSaveDraft, canScheduleExam, submissionError, submitExam, submitMode } = useExamCreation({
    duration,
    examId,
    examTitle,
    mode: "edit",
    questions,
    reportReleaseMode,
    scheduleEntries,
  })

  const handleDelete = async () => {
    const confirmed = window.confirm("Delete this exam? This cannot be undone.")
    if (!confirmed) return

    setIsDeleting(true)

    try {
      await deleteExam(examId)
      toast({
        title: "Exam deleted",
        description: "The scheduled exam was deleted successfully.",
      })
      router.push("/teacher/exams")
    } catch (error) {
      toast({
        title: "Could not delete exam",
        description: error instanceof Error ? error.message : "Something went wrong while deleting the exam.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(false)
    }
  }

  const handleAiSourceDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsAiSourceDragging(true)
  }
  const handleAiSourceDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsAiSourceDragging(false)
  }
  const handleAiSourceDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsAiSourceDragging(false)
    addAiSourceFiles(e.dataTransfer.files)
  }
  const handleAiSourceSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files) return
    addAiSourceFiles(files)
    e.target.value = ""
  }

  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0)
  const questionCounts = {
    "multiple-choice": questions.filter(q => q.type === "multiple-choice").length,
    "true-false": questions.filter(q => q.type === "true-false").length,
    "short-answer": questions.filter(q => q.type === "short-answer").length,
    "essay": questions.filter(q => q.type === "essay").length,
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/teacher/exams" className="text-sm text-muted-foreground hover:underline">
            &larr; Back to Exams
          </Link>
          <h1 className="text-2xl font-bold mt-2">Edit Scheduled Exam</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowAIDialog(true)}>
            Prepare Questions with AI
          </Button>
          <Button variant="destructive" onClick={() => void handleDelete()} disabled={isDeleting || isLoading}>
            {isDeleting ? <Spinner className="mr-2" /> : <Trash2 className="mr-2 h-4 w-4" />}
            Delete Exam
          </Button>
        </div>
      </div>

      {loadError ? (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Could not load exam</AlertTitle>
          <AlertDescription>{loadError}</AlertDescription>
        </Alert>
      ) : null}
      {submissionError ? <Alert variant="destructive"><CircleAlert /><AlertTitle>Save failed</AlertTitle><AlertDescription>{submissionError}</AlertDescription></Alert> : null}

      <Card>
        <CardContent className="pt-6">
          <Input
            placeholder="Untitled Exam"
            value={examTitle}
            onChange={(e) => setExamTitle(e.target.value)}
            className="text-xl font-semibold border-0 border-b rounded-none focus-visible:ring-0 px-0"
            disabled={isLoading}
          />
        </CardContent>
      </Card>

      <ExamBuilderQuestionList
        onAddQuestion={addQuestion}
        onRemoveQuestion={removeQuestion}
        onUpdateOption={updateOption}
        onUpdateQuestion={updateQuestion}
        questions={questions}
      />
      <ExamBuilderSummaryCard
        duration={duration}
        onAddScheduleEntry={addScheduleEntry}
        onDurationChange={setDuration}
        onRemoveScheduleEntry={removeScheduleEntry}
        onReportReleaseModeChange={setReportReleaseMode}
        onScheduleEntryChange={updateScheduleEntry}
        questionCounts={questionCounts}
        questionTotal={questions.length}
        reportReleaseMode={reportReleaseMode}
        scheduleEntries={scheduleEntries}
        totalPoints={totalPoints}
      />
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={() => void submitExam("draft")} disabled={!canSaveDraft || isLoading}>
          {submitMode === "draft" ? <Spinner className="mr-2" /> : null}
          Save as Draft
        </Button>
        <Button onClick={() => void submitExam("scheduled")} disabled={!canScheduleExam || isLoading}>
          {submitMode === "scheduled" ? <Spinner className="mr-2" /> : null}
          Update Scheduled Exam
        </Button>
      </div>
      <AIQuestionGeneratorDialog
        aiMCCount={aiMCCount}
        aiShortCount={aiShortCount}
        aiTFCount={aiTFCount}
        isGenerating={isGenerating}
        onGenerate={generateAIQuestions}
        isDragging={isAiSourceDragging}
        onOpenChange={setShowAIDialog}
        onDragLeave={handleAiSourceDragLeave}
        onDragOver={handleAiSourceDragOver}
        onDrop={handleAiSourceDrop}
        onFileSelect={handleAiSourceSelect}
        onRemoveSourceFile={removeAiSourceFile}
        onToggleTest={(testId, checked) =>
          setSelectedMockTests((current) =>
            checked
              ? [...current, testId]
              : current.filter((id) => id !== testId),
          )
        }
        open={showAIDialog}
        selectedSourceFiles={selectedAiSourceFiles}
        selectedMockTests={selectedMockTests}
        setAiMCCount={setAiMCCount}
        setAiShortCount={setAiShortCount}
        setAiTFCount={setAiTFCount}
      />
    </div>
  )
}
