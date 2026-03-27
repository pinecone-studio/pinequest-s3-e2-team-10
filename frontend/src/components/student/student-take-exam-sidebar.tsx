"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"

export function StudentTakeExamSidebar(props: {
  answeredCount: number
  totalQuestions: number
  completionPercent: number
  unansweredCount: number
  isSubmitting: boolean
  onSubmit: () => void
  onBack: () => void
}) {
  const {
    answeredCount,
    totalQuestions,
    completionPercent,
    unansweredCount,
    isSubmitting,
    onSubmit,
    onBack,
  } = props

  return (
    <div className="space-y-4 lg:sticky lg:top-6 lg:self-start">
      <Card className="rounded-[1.5rem] border-sky-100 bg-white/95 shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg text-slate-900">Явц</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Хариулсан</span>
              <span className="font-semibold text-slate-900">
                {answeredCount}/{totalQuestions}
              </span>
            </div>
            <Progress value={completionPercent} className="h-3 bg-slate-100" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-2xl bg-emerald-50 p-4">
              <div className="text-sm text-emerald-700">Хариулсан</div>
              <div className="mt-1 text-2xl font-bold text-emerald-900">{answeredCount}</div>
            </div>
            <div className="rounded-2xl bg-amber-50 p-4">
              <div className="text-sm text-amber-700">Үлдсэн</div>
              <div className="mt-1 text-2xl font-bold text-amber-900">{unansweredCount}</div>
            </div>
          </div>
          <p className="text-sm leading-6 text-slate-600">
            Илгээхээс өмнө хариулаагүй асуулт үлдсэн эсэхийг шалгаарай.
          </p>
        </CardContent>
      </Card>

      <Card className="rounded-[1.5rem] border-slate-200 bg-slate-900 text-white shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Шалгалт дуусгах</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-6 text-slate-200">
            Илгээсний дараа хариултыг хадгалж тайлан руу шилжинэ.
          </p>
          <div className="grid gap-3">
            <Button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="h-11 rounded-xl bg-white text-slate-900 hover:bg-slate-100"
            >
              {isSubmitting ? "Илгээж байна..." : "Шалгалт илгээх"}
            </Button>
            <Button
              variant="outline"
              onClick={onBack}
              className="h-11 rounded-xl border-white/20 bg-transparent text-white hover:bg-white/10"
            >
              Буцах
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
