'use client'

import * as React from 'react'
import { AIQuestionGeneratorDialog } from '@/components/teacher/ai-question-generator-dialog'
import type { AIQuestionTypeCounts } from '@/components/teacher/ai-question-generator-dialog-types'

export function EditExamAiDialog({
  addAiSourceFiles,
  aiQuestionTypeCounts,
  generateAIQuestions,
  isAiSourceDragging,
  isGenerating,
  open,
  removeAiSourceFile,
  selectedMockTests,
  selectedSourceFiles,
  setAiQuestionTypeCounts,
  setIsAiSourceDragging,
  setSelectedMockTests,
  setShowAIDialog,
}: {
  addAiSourceFiles: (files: FileList) => void
  aiQuestionTypeCounts: AIQuestionTypeCounts
  generateAIQuestions: () => Promise<void>
  isAiSourceDragging: boolean
  isGenerating: boolean
  open: boolean
  removeAiSourceFile: (fileName: string) => void
  selectedMockTests: string[]
  selectedSourceFiles: File[]
  setAiQuestionTypeCounts: (value: AIQuestionTypeCounts) => void
  setIsAiSourceDragging: (value: boolean) => void
  setSelectedMockTests: React.Dispatch<React.SetStateAction<string[]>>
  setShowAIDialog: (value: boolean) => void
}) {
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
    e.target.value = ''
  }

  return (
    <AIQuestionGeneratorDialog
      aiQuestionTypeCounts={aiQuestionTypeCounts}
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
          checked ? [...current, testId] : current.filter((id) => id !== testId),
        )
      }
      open={open}
      selectedSourceFiles={selectedSourceFiles}
      selectedMockTests={selectedMockTests}
      setAiQuestionTypeCounts={setAiQuestionTypeCounts}
    />
  )
}
