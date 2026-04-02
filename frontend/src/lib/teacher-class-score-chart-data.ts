import type { ExamResult, Student } from "@/lib/mock-data-types"
import { getAwardedPoints, normalizeExamDifficulty, type ExamDifficultyBucket } from "@/lib/teacher-class-detail"
import type { TeacherExam } from "@/lib/teacher-exams"

export type TeacherClassSummaryRow = {
  accent: string
  label: string
  value: string
}

export type ExamQualityChartPoint = {
  bucketKey: string
  bucketLabel: string
  easyRatio: number | null
  mediumRatio: number | null
  hardRatio: number | null
  easyEarned: number
  easyPossible: number
  mediumEarned: number
  mediumPossible: number
  hardEarned: number
  hardPossible: number
}

export type ExamQualityChartModel = {
  bucketLabel: "topic" | "category"
  bucketLabelText: string
  data: ExamQualityChartPoint[]
  difficultyRows: TeacherClassSummaryRow[]
  difficultySparklineValues: number[]
  headlineValue: string
  hasData: boolean
  bestBucket: { label: string; ratio: number } | null
  mostMissedBucket: { label: string; ratio: number } | null
  overallAverage: number | null
  summaryRows: TeacherClassSummaryRow[]
  topicSparklineValues: number[]
  totalStudents: number
  yAxisTicks: number[]
}

type DifficultyAccumulator = Record<ExamDifficultyBucket, { earned: number; possible: number }>

const DIFFICULTY_META: Record<ExamDifficultyBucket, { accent: string; label: string }> = {
  easy: { accent: "#8ed8b9", label: "Хөнгөн" },
  medium: { accent: "#8cb2ff", label: "Дунд" },
  hard: { accent: "#f3b2c7", label: "Хүнд" },
}

function createDifficultyAccumulator(): DifficultyAccumulator {
  return {
    easy: { earned: 0, possible: 0 },
    medium: { earned: 0, possible: 0 },
    hard: { earned: 0, possible: 0 },
  }
}

function toPercent(earned: number, possible: number) {
  if (possible <= 0) {
    return null
  }

  return Math.round((earned / possible) * 100)
}

function formatPercent(value: number | null) {
  return value === null ? "—" : `${value}%`
}

function chooseBucketMode(exam: TeacherExam): "topic" | "category" {
  const categoryCount = new Set(
    exam.questions.map((question) => question.categoryName?.trim()).filter(Boolean),
  ).size
  const normalizedTitle = exam.title.toLowerCase()
  const largeExamKeywords = ["term", "final", "promotion", "нэгдсэн", "улирал"]

  if (
    exam.questions.length >= 9 ||
    categoryCount >= 3 ||
    largeExamKeywords.some((keyword) => normalizedTitle.includes(keyword))
  ) {
    return "category"
  }

  return "topic"
}

export function buildExamQualityChartModel(args: {
  exam: TeacherExam | null
  results: ExamResult[]
  students: Student[]
}): ExamQualityChartModel {
  const { exam, results, students } = args

  if (!exam) {
    return {
      bucketLabel: "topic",
      bucketLabelText: "Сэдэв",
      data: [],
      difficultyRows: [
        { accent: DIFFICULTY_META.easy.accent, label: "Хөнгөн дундаж", value: "—" },
        { accent: DIFFICULTY_META.medium.accent, label: "Дунд дундаж", value: "—" },
        { accent: DIFFICULTY_META.hard.accent, label: "Хүнд дундаж", value: "—" },
      ],
      difficultySparklineValues: [0, 0, 0],
      headlineValue: "—",
      hasData: false,
      bestBucket: null,
      mostMissedBucket: null,
      overallAverage: null,
      summaryRows: [
        { accent: "#9bb0ff", label: "X тэнхлэг", value: "Сэдэв" },
        { accent: "#f3b2c7", label: "Хамгийн сул", value: "—" },
        { accent: "#8ed8b9", label: "Хамгийн сайн", value: "—" },
      ],
      topicSparklineValues: [0, 0, 0],
      totalStudents: 0,
      yAxisTicks: [0, 25, 50, 75, 100],
    }
  }

  const studentIds = new Set(students.map((student) => student.id))
  const relevantResults = results.filter((result) => studentIds.has(result.studentId))
  const bucketMode = chooseBucketMode(exam)
  const bucketMap = new Map<
    string,
    {
      key: string
      label: string
      difficulties: DifficultyAccumulator
      overall: { earned: number; possible: number }
    }
  >()

  exam.questions.forEach((question) => {
    const bucketKey =
      (bucketMode === "topic" ? question.topicName : question.categoryName)?.trim() ||
      question.topicName?.trim() ||
      question.categoryName?.trim() ||
      "Тодорхойгүй"

    if (!bucketMap.has(bucketKey)) {
      bucketMap.set(bucketKey, {
        key: bucketKey,
        label: bucketKey,
        difficulties: createDifficultyAccumulator(),
        overall: { earned: 0, possible: 0 },
      })
    }
  })

  relevantResults.forEach((result) => {
    const answerMap = new Map(result.answers.map((answer) => [answer.questionId, answer]))

    exam.questions.forEach((question) => {
      const bucketKey =
        (bucketMode === "topic" ? question.topicName : question.categoryName)?.trim() ||
        question.topicName?.trim() ||
        question.categoryName?.trim() ||
        "Тодорхойгүй"
      const bucket = bucketMap.get(bucketKey)
      if (!bucket) {
        return
      }

      const difficulty = normalizeExamDifficulty(question.difficulty)
      const awardedPoints = getAwardedPoints(question.points, answerMap.get(question.id))

      bucket.difficulties[difficulty].earned += awardedPoints
      bucket.difficulties[difficulty].possible += question.points
      bucket.overall.earned += awardedPoints
      bucket.overall.possible += question.points
    })
  })

  const data = Array.from(bucketMap.values()).map((bucket) => ({
    bucketKey: bucket.key,
    bucketLabel: bucket.label,
    easyRatio: toPercent(bucket.difficulties.easy.earned, bucket.difficulties.easy.possible),
    mediumRatio: toPercent(bucket.difficulties.medium.earned, bucket.difficulties.medium.possible),
    hardRatio: toPercent(bucket.difficulties.hard.earned, bucket.difficulties.hard.possible),
    easyEarned: bucket.difficulties.easy.earned,
    easyPossible: bucket.difficulties.easy.possible,
    mediumEarned: bucket.difficulties.medium.earned,
    mediumPossible: bucket.difficulties.medium.possible,
    hardEarned: bucket.difficulties.hard.earned,
    hardPossible: bucket.difficulties.hard.possible,
  }))

  const totals = data.reduce(
    (accumulator, bucket) => {
      accumulator.easy.earned += bucket.easyEarned
      accumulator.easy.possible += bucket.easyPossible
      accumulator.medium.earned += bucket.mediumEarned
      accumulator.medium.possible += bucket.mediumPossible
      accumulator.hard.earned += bucket.hardEarned
      accumulator.hard.possible += bucket.hardPossible
      accumulator.overall.earned += bucket.easyEarned + bucket.mediumEarned + bucket.hardEarned
      accumulator.overall.possible += bucket.easyPossible + bucket.mediumPossible + bucket.hardPossible
      return accumulator
    },
    {
      easy: { earned: 0, possible: 0 },
      medium: { earned: 0, possible: 0 },
      hard: { earned: 0, possible: 0 },
      overall: { earned: 0, possible: 0 },
    },
  )

  const difficultyRows: TeacherClassSummaryRow[] = (["easy", "medium", "hard"] as const).map(
    (difficulty) => ({
      accent: DIFFICULTY_META[difficulty].accent,
      label: `${DIFFICULTY_META[difficulty].label} дундаж`,
      value: formatPercent(toPercent(totals[difficulty].earned, totals[difficulty].possible)),
    }),
  )

  const bucketRatios = data
    .map((bucket) => ({
      label: bucket.bucketLabel,
      ratio: toPercent(
        bucket.easyEarned + bucket.mediumEarned + bucket.hardEarned,
        bucket.easyPossible + bucket.mediumPossible + bucket.hardPossible,
      ),
    }))
    .filter((bucket): bucket is { label: string; ratio: number } => bucket.ratio !== null)

  const mostMissedBucket = bucketRatios.length
    ? bucketRatios.reduce((lowest, current) => (current.ratio < lowest.ratio ? current : lowest))
    : null
  const bestBucket = bucketRatios.length
    ? bucketRatios.reduce((highest, current) => (current.ratio > highest.ratio ? current : highest))
    : null
  const overallAverage = toPercent(totals.overall.earned, totals.overall.possible)

  return {
    bucketLabel: bucketMode,
    bucketLabelText: bucketMode === "topic" ? "Сэдэв" : "Ангилал",
    data,
    difficultyRows,
    difficultySparklineValues: [
      toPercent(totals.easy.earned, totals.easy.possible) ?? 0,
      toPercent(totals.medium.earned, totals.medium.possible) ?? 0,
      toPercent(totals.hard.earned, totals.hard.possible) ?? 0,
    ],
    headlineValue: formatPercent(overallAverage),
    hasData:
      relevantResults.length > 0 &&
      data.some(
        (bucket) =>
          bucket.easyRatio !== null ||
          bucket.mediumRatio !== null ||
          bucket.hardRatio !== null,
      ),
    bestBucket,
    mostMissedBucket,
    overallAverage,
    summaryRows: [
      { accent: "#9bb0ff", label: "X тэнхлэг", value: bucketMode === "topic" ? "Сэдэв" : "Ангилал" },
      {
        accent: "#f3b2c7",
        label: "Хамгийн сул",
        value: mostMissedBucket ? `${mostMissedBucket.label} · ${mostMissedBucket.ratio}%` : "—",
      },
      {
        accent: "#8ed8b9",
        label: "Хамгийн сайн",
        value: bestBucket ? `${bestBucket.label} · ${bestBucket.ratio}%` : "—",
      },
    ],
    topicSparklineValues: data.map((bucket) =>
      toPercent(
        bucket.easyEarned + bucket.mediumEarned + bucket.hardEarned,
        bucket.easyPossible + bucket.mediumPossible + bucket.hardPossible,
      ) ?? 0,
    ),
    totalStudents: relevantResults.length,
    yAxisTicks: [0, 25, 50, 75, 100],
  }
}
