"use client"

import { Button } from "@/components/ui/button"
import { Spinner } from "@/components/ui/spinner"

export function CreateExamSubmitActions(props: {
  canSaveDraft: boolean
  canScheduleExam: boolean
  submitMode: "draft" | "scheduled" | null
  onSubmitDraft: () => void
  onSubmitScheduled: () => void
}) {
  const { canSaveDraft, canScheduleExam, submitMode, onSubmitDraft, onSubmitScheduled } = props

  return (
    <div className="flex justify-end gap-3">
      <Button variant="outline" onClick={onSubmitDraft} disabled={!canSaveDraft}>
        {submitMode === "draft" ? <Spinner className="mr-2" /> : null}
        Ноорог болгон хадгалах
      </Button>
      <Button onClick={onSubmitScheduled} disabled={!canScheduleExam}>
        {submitMode === "scheduled" ? <Spinner className="mr-2" /> : null}
        Үүсгээд сурагчдад мэдэгдэх
      </Button>
    </div>
  )
}
