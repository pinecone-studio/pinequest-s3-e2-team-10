"use client"

import * as React from "react"
import { CircleAlert } from "lucide-react"
import { AIQuestionGeneratorDialog } from "@/components/teacher/ai-question-generator-dialog"
import { CreateExamPageHeader } from "@/components/teacher/create-exam-page-header"
import { CreateExamSubmitActions } from "@/components/teacher/create-exam-submit-actions"
import { ExamBuilderQuestionList } from "@/components/teacher/exam-builder-question-list"
import { ExamBuilderSummaryCard } from "@/components/teacher/exam-builder-summary-card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useExamBuilder } from "@/hooks/use-exam-builder"
import { useExamCreation } from "@/hooks/use-exam-creation"

export default function CreateExamPage() {
  const titleSectionRef = React.useRef<HTMLDivElement | null>(null)
  const questionsSectionRef = React.useRef<HTMLDivElement | null>(null)
  const settingsSectionRef = React.useRef<HTMLDivElement | null>(null)
  const scheduleSectionRef = React.useRef<HTMLDivElement | null>(null)

  const scrollToSection = React.useCallback((section: "title" | "questions" | "settings" | "schedule") => {
    const sectionMap = { title: titleSectionRef, questions: questionsSectionRef, settings: settingsSectionRef, schedule: scheduleSectionRef } as const
    const target = sectionMap[section].current
    if (!target) return
    target.scrollIntoView({ behavior: "smooth", block: "start" })
    target.querySelector<HTMLElement>("input, textarea, button, [role='combobox']")?.focus({ preventScroll: true })
  }, [])

  const builder = useExamBuilder()
  const creation = useExamCreation({
    duration: builder.duration,
    examTitle: builder.examTitle,
    onValidationError: scrollToSection,
    questions: builder.questions,
    reportReleaseMode: builder.reportReleaseMode,
    scheduleEntries: builder.scheduleEntries,
  })

  const totalPoints = builder.questions.reduce((sum, question) => sum + question.points, 0)
  const questionCounts = {
    "multiple-choice": builder.questions.filter((question) => question.type === "multiple-choice").length,
    "true-false": builder.questions.filter((question) => question.type === "true-false").length,
    "short-answer": builder.questions.filter((question) => question.type === "short-answer").length,
    essay: builder.questions.filter((question) => question.type === "essay").length,
  }

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <CreateExamPageHeader onOpenAi={() => builder.setShowAIDialog(true)} />

      <div ref={titleSectionRef}>
        <Card>
          <CardContent className="pt-6">
            <Input
              placeholder="Шалгалтын нэр оруулна уу"
              value={builder.examTitle}
              onChange={(event) => builder.setExamTitle(event.target.value)}
              className="rounded-none border-0 border-b px-0 text-xl font-semibold focus-visible:ring-0"
            />
          </CardContent>
        </Card>
      </div>

      {creation.submissionError ? (
        <Alert variant="destructive">
          <CircleAlert />
          <AlertTitle>Хадгалж чадсангүй</AlertTitle>
          <AlertDescription>{creation.submissionError}</AlertDescription>
        </Alert>
      ) : null}

      <div ref={questionsSectionRef}>
        <ExamBuilderQuestionList
          onAddQuestion={builder.addQuestion}
          onRemoveQuestion={builder.removeQuestion}
          onUpdateOption={builder.updateOption}
          onUpdateQuestion={builder.updateQuestion}
          questions={builder.questions}
        />
      </div>

      <div ref={settingsSectionRef}>
        <div ref={scheduleSectionRef}>
          <ExamBuilderSummaryCard
            duration={builder.duration}
            onAddScheduleEntry={builder.addScheduleEntry}
            onDurationChange={builder.setDuration}
            onRemoveScheduleEntry={builder.removeScheduleEntry}
            onReportReleaseModeChange={builder.setReportReleaseMode}
            onScheduleEntryChange={builder.updateScheduleEntry}
            questionCounts={questionCounts}
            questionTotal={builder.questions.length}
            reportReleaseMode={builder.reportReleaseMode}
            scheduleEntries={builder.scheduleEntries}
            totalPoints={totalPoints}
          />
        </div>
      </div>

      <CreateExamSubmitActions
        canSaveDraft={creation.canSaveDraft}
        canScheduleExam={creation.canScheduleExam}
        submitMode={creation.submitMode}
        onSubmitDraft={() => void creation.submitExam("draft")}
        onSubmitScheduled={() => void creation.submitExam("scheduled")}
      />

      <AIQuestionGeneratorDialog
        aiMCCount={builder.aiMCCount}
        aiShortCount={builder.aiShortCount}
        aiTFCount={builder.aiTFCount}
        isGenerating={builder.isGenerating}
        onGenerate={builder.generateAIQuestions}
        isDragging={builder.isAiSourceDragging}
        onOpenChange={builder.setShowAIDialog}
        onDragLeave={(e) => { e.preventDefault(); builder.setIsAiSourceDragging(false) }}
        onDragOver={(e) => { e.preventDefault(); builder.setIsAiSourceDragging(true) }}
        onDrop={(e) => { e.preventDefault(); builder.setIsAiSourceDragging(false); builder.addAiSourceFiles(e.dataTransfer.files) }}
        onFileSelect={(e) => { if (e.target.files) builder.addAiSourceFiles(e.target.files); e.target.value = "" }}
        onRemoveSourceFile={builder.removeAiSourceFile}
        onToggleTest={(testId, checked) => builder.setSelectedMockTests((current) => checked ? [...current, testId] : current.filter((id) => id !== testId))}
        open={builder.showAIDialog}
        selectedSourceFiles={builder.selectedAiSourceFiles}
        selectedMockTests={builder.selectedMockTests}
        setAiMCCount={builder.setAiMCCount}
        setAiShortCount={builder.setAiShortCount}
        setAiTFCount={builder.setAiTFCount}
      />
    </div>
  )
}
