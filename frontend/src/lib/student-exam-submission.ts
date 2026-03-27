import type { ExamQuestion } from "@/lib/mock-data"

function normalizeAnswer(value: string | undefined) {
  return (value ?? "").trim().toLowerCase()
}

export function gradeQuestion(question: ExamQuestion, answer: string) {
  if (!answer.trim()) return null
  if (question.type === "short-answer" || question.type === "essay") return null
  if (!question.correctAnswer) return null
  return normalizeAnswer(question.correctAnswer) === normalizeAnswer(answer)
}

export function getAwardedPoints(
  question: ExamQuestion,
  answer: string,
  isCorrect: boolean | null,
) {
  if (!answer.trim()) return 0
  if (question.type === "short-answer" || question.type === "essay") return null
  return isCorrect ? question.points : 0
}

export function getReviewStatus(
  question: ExamQuestion,
  answer: string,
  isCorrect: boolean | null,
) {
  if (!answer.trim()) return undefined
  if (question.type === "short-answer" || question.type === "essay") return "pending" as const
  return isCorrect ? ("auto-correct" as const) : ("auto-wrong" as const)
}

export function getQuestionTypeLabel(question: ExamQuestion) {
  switch (question.type) {
    case "multiple-choice":
      return "Сонгох асуулт"
    case "true-false":
      return "Үнэн / Худал"
    case "short-answer":
      return "Богино хариулт"
    case "essay":
      return "Дэлгэрэнгүй хариулт"
    default:
      return "Асуулт"
  }
}
