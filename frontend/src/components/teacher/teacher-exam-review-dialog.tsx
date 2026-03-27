"use client"

import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import type { ExamResult, Student } from "@/lib/mock-data"
import { getAnswerReviewState } from "@/lib/student-report-view"
import type { TeacherExam } from "@/lib/teacher-exams"

export function TeacherExamReviewDialog(props: {
  open: boolean
  onOpenChange: (open: boolean) => void
  className: string
  exam: TeacherExam
  selectedStudent: Student | null
  selectedResult: ExamResult | null
  reviewQuestions: Array<{ question: TeacherExam["questions"][number]; answer: ExamResult["answers"][number] | undefined }>
  draftScores: Record<string, string>
  isSaving: boolean
  onScoreChange: (questionId: string, value: string) => void
  onSave: () => void
}) {
  const { open, onOpenChange, className, exam, selectedStudent, selectedResult, reviewQuestions, draftScores, isSaving, onScoreChange, onSave } = props

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-4xl">
        <DialogHeader className="space-y-3">
          <DialogTitle>{selectedStudent ? `${selectedStudent.name} · ${className}` : "Илгээсэн сурагч"}</DialogTitle>
          <DialogDescription>
            {selectedStudent ? "Энд тухайн сурагчийн задгай хариултууд, одоогийн оноо, хүлээгдэж буй үнэлгээний төлөв харагдана." : "Сурагчийн хариултыг шалгах цонх."}
          </DialogDescription>
          {selectedResult ? (
            <div className="grid gap-3 md:grid-cols-3">
              <DialogMetric label="Одоогийн оноо" value={`${selectedResult.score}/${selectedResult.totalPoints}`} />
              <DialogMetric label="Илгээсэн хугацаа" value={new Date(selectedResult.submittedAt).toLocaleString("mn-MN")} />
              <DialogMetric label="Үнэлгээний төлөв" value={reviewQuestions.length > 0 ? `${reviewQuestions.length} задгай хариултад оноо өгөх шаардлагатай.` : "Энэ сурагчийн бүх задгай хариултад оноо өгч дууссан байна."} />
            </div>
          ) : null}
        </DialogHeader>

        <div className="space-y-4">
          {selectedResult ? reviewQuestions.length > 0 ? reviewQuestions.map(({ question, answer }) => {
            const reviewState = getAnswerReviewState(question, answer)

            return (
              <div key={question.id} className="rounded-2xl border border-sky-100 bg-sky-50/30 p-4">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-sky-700">
                    Асуулт {exam.questions.findIndex((entry) => entry.id === question.id) + 1} · {question.type === "essay" ? "Эсээ" : "Богино хариулт"} · {question.points} оноо
                  </p>
                  <h3 className="text-base font-semibold text-slate-900">{question.question}</h3>
                  <p className="text-sm text-slate-600">
                    {reviewState === "pending" ? "Энэ хариулт одоогоор үнэлгээ хүлээж байна. Доор оноо оруулж хадгална уу." : "Энэ хариултад оноо өгсөн байна. Хэрэв шаардлагатай бол оноог шинэчилж болно."}
                  </p>
                </div>

                <div className="mt-4 grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
                  <div className="rounded-xl border border-slate-200 bg-white p-4">
                    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">Сурагчийн хариулт</p>
                    <p className="mt-2 whitespace-pre-wrap text-sm leading-6 text-slate-700">{answer?.answer}</p>
                  </div>
                  <div className="rounded-xl border-2 border-sky-200 bg-white p-4 shadow-sm">
                    <label htmlFor={`score-${question.id}`} className="text-sm font-semibold text-slate-700">Өгөх оноо</label>
                    <Input
                      id={`score-${question.id}`}
                      type="number"
                      min={0}
                      max={question.points}
                      step={1}
                      value={draftScores[question.id] ?? ""}
                      onChange={(event) => onScoreChange(question.id, event.target.value)}
                      className="mt-3 h-12 border-2 border-sky-300 bg-sky-50 text-base font-semibold text-slate-900 shadow-none focus-visible:border-sky-500 focus-visible:ring-sky-200"
                    />
                    <p className="mt-2 text-xs leading-5 text-slate-500">
                      0-{question.points} хүртэл оноо оруулна. Хадгалсны дараа сурагчийн тайлан болон нийт оноо шууд шинэчлэгдэнэ.
                    </p>
                  </div>
                </div>
              </div>
            )
          }) : (
            <div className="flex items-center gap-2 rounded-2xl border border-dashed border-slate-300 bg-white p-4 text-sm text-slate-600">
              <AlertCircle className="h-4 w-4" />
              Энэ сурагчид гараар үнэлэх задгай хариулт алга.
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Хаах</Button>
          <Button onClick={onSave} disabled={isSaving || reviewQuestions.length === 0}>
            {isSaving ? "Хадгалж байна..." : "Үнэлгээ хадгалах"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function DialogMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{label}</div>
      <div className="mt-2 text-sm font-medium leading-6 text-slate-900">{value}</div>
    </div>
  )
}
