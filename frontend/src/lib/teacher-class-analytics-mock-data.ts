import type { ExamResult } from "@/lib/mock-data-types";
import { examE1 } from "@/lib/mock-exams-seed/exam-e1";
import { examE2 } from "@/lib/mock-exams-seed/exam-e2";
import { examE3 } from "@/lib/mock-exams-seed/exam-e3";
import { examE4 } from "@/lib/mock-exams-seed/exam-e4";
import { examE5 } from "@/lib/mock-exams-seed/exam-e5";
import { examE6 } from "@/lib/mock-exams-seed/exam-e6";
import { students } from "@/lib/mock-students";
import {
  mapLegacyExamToTeacherExam,
  type TeacherExam,
} from "@/lib/teacher-exams";

const analyticsExams = [examE1, examE2, examE3, examE4, examE5, examE6];
const analyticsStudents = students.filter((student) =>
  analyticsExams.some((exam) =>
    exam.scheduledClasses.some(
      (schedule) => schedule.classId === student.classId,
    ),
  ),
);

const examPerformanceOffsets: Record<string, number> = {
  e1: 0.02,
  e2: -0.01,
  e3: 0.01,
  e4: -0.02,
  e5: -0.03,
  e6: -0.01,
};
const strongStudents = new Set(["judge1", "judge3", "s7", "s16", "s11", "s13"]);
const weakStudents = new Set(["judge5", "judge8", "s2", "s8", "s4", "s14"]);

const clamp = (value: number, min: number, max: number) =>
  Math.max(min, Math.min(max, value));
const getAwardedPoints = (points: number, ratio: number) =>
  clamp(Math.round(points * ratio), 0, points);
const getStudentVariance = (studentId: string) =>
  ((studentId.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) %
    7) -
    3) *
  0.01;
const getQuestionVariance = (seed: string) =>
  ((seed.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0) % 9) -
    4) *
  0.01;
function buildReviewStatus(
  awardedPoints: number,
  points: number,
): NonNullable<ExamResult["answers"][number]["reviewStatus"]> {
  return awardedPoints === points
    ? "auto-correct"
    : awardedPoints === 0
      ? "auto-wrong"
      : "graded";
}

function buildAnswerText(
  awardedPoints: number,
  correctAnswer: string,
  points: number,
  type: string,
) {
  if (awardedPoints === points) return correctAnswer;
  if (awardedPoints === 0)
    return type === "true-false"
      ? correctAnswer === "True"
        ? "False"
        : "True"
      : type === "multiple-choice"
        ? "Буруу сонголт"
        : type === "ordering"
          ? "1,3,2,4"
          : type === "matching"
            ? "A-4, B-3, C-2, D-1"
            : "Бодож эхэлсэн ч буруу гаргасан.";
  if (type === "short-answer") return `${correctAnswer} орчим гэж бодсон.`;
  return type === "matching"
    ? "Хэсэгчлэн зөв тааруулсан."
    : type === "ordering"
      ? "Алхамын дарааллын нэг хэсгийг зөв тавьсан."
      : correctAnswer;
}

function getStudentProfile(studentId: string, classId: string) {
  const tier = strongStudents.has(studentId)
    ? { easy: 0.88, medium: 0.76, hard: 0.62 }
    : weakStudents.has(studentId)
      ? { easy: 0.52, medium: 0.34, hard: 0.18 }
      : { easy: 0.7, medium: 0.52, hard: 0.34 };
  const classOffset = classId === "10A" ? 0.02 : classId === "10C" ? -0.01 : 0;
  const studentVariance = getStudentVariance(studentId);

  return {
    difficulty: {
      easy: clamp(tier.easy + classOffset + studentVariance, 0.08, 1),
      medium: clamp(tier.medium + classOffset + studentVariance * 0.8, 0.08, 1),
      hard: clamp(tier.hard + classOffset + studentVariance * 1.2, 0.08, 1),
    },
    categories: {
      Бутархай:
        (studentId.endsWith("1") || studentId.endsWith("6") ? 0.03 : 0) +
        studentVariance,
      Харьцаа:
        (studentId.endsWith("2") || studentId.endsWith("7") ? 0.02 : -0.01) -
        studentVariance * 0.4,
      "Тоон шулуун":
        (studentId.endsWith("3") ? 0.02 : 0) + studentVariance * 0.2,
      Хувь:
        (studentId.endsWith("4") || studentId.endsWith("9") ? 0.03 : 0) +
        studentVariance * 0.3,
      Хөнгөлөлт:
        (studentId.endsWith("5") ? -0.02 : 0.01) - studentVariance * 0.2,
      Диаграмм: (classId === "10A" ? 0.01 : 0) + studentVariance * 0.4,
      Периметр:
        (studentId.endsWith("8") ? -0.02 : 0.01) + studentVariance * 0.2,
      Талбай: (classId === "10C" ? -0.01 : 0.01) + studentVariance * 0.5,
      "Дүрс байгуулалт":
        (studentId.endsWith("7") ? 0.02 : 0) - studentVariance * 0.1,
      Илэрхийлэл:
        (studentId.endsWith("1") || studentId.endsWith("3") ? 0.03 : 0) +
        studentVariance * 0.4,
      "Нэг хувьсагчтай тэгшитгэл":
        (studentId.endsWith("6") ? 0.02 : 0) + studentVariance * 0.3,
      "Текст бодлого":
        (studentId.endsWith("4") ? -0.02 : 0.01) - studentVariance * 0.2,
      Пропорц:
        (studentId.endsWith("2") || studentId.endsWith("9") ? 0.02 : 0) +
        studentVariance * 0.5,
      Масштаб: (classId === "10B" ? 0.01 : 0) + studentVariance * 0.4,
      "Нэгж хувиргалт":
        (classId === "10C" ? -0.01 : 0.01) + studentVariance * 0.3,
      "Хүснэгт ба график":
        (studentId.endsWith("5") ? 0.02 : 0) + studentVariance * 0.2,
      Дундаж: (studentId.endsWith("8") ? -0.02 : 0.01) - studentVariance * 0.3,
      "Энгийн магадлал":
        (studentId.endsWith("2") || studentId.endsWith("7") ? 0.02 : 0) +
        studentVariance * 0.5,
    },
  };
}

function buildCompletedExamResult(
  exam: (typeof analyticsExams)[number],
  examIndex: number,
  student: (typeof analyticsStudents)[number],
  studentIndex: number,
): ExamResult {
  const profile = getStudentProfile(student.id, student.classId);
  const answers = exam.questions.map((question) => {
    const difficulty = (question.difficulty ?? "medium") as
      | "easy"
      | "medium"
      | "hard";
    const categoryOffset =
      profile.categories[
        (question.categoryName ?? "Алгебр") as keyof typeof profile.categories
      ] ?? 0;
    const questionVariance = getQuestionVariance(
      `${student.classId}-${student.id}-${exam.id}-${question.id}`,
    );
    const ratio = clamp(
      profile.difficulty[difficulty] +
        categoryOffset +
        (examPerformanceOffsets[exam.id] ?? 0) +
        questionVariance,
      0.08,
      1,
    );
    const awardedPoints = getAwardedPoints(question.points, ratio);
    return {
      questionId: question.id,
      awardedPoints,
      isCorrect:
        awardedPoints === question.points
          ? true
          : awardedPoints === 0
            ? false
            : null,
      answer: buildAnswerText(
        awardedPoints,
        question.correctAnswer ?? "",
        question.points,
        question.type,
      ),
      reviewStatus: buildReviewStatus(awardedPoints, question.points),
    };
  });

  const schedule =
    exam.scheduledClasses.find((entry) => entry.classId === student.classId) ??
    exam.scheduledClasses[0];
  const startMinute = Number(schedule.time.split(":")[1]);
  const startHour = Number(schedule.time.split(":")[0]);
  const finalMinuteCount =
    startMinute + 18 + (studentIndex % 8) * 3 + examIndex * 2;
  return {
    examId: exam.id,
    studentId: student.id,
    classId: student.classId,
    score: answers.reduce(
      (sum, answer) => sum + (answer.awardedPoints ?? 0),
      0,
    ),
    totalPoints: exam.questions.reduce(
      (sum, question) => sum + question.points,
      0,
    ),
    submittedAt: `${schedule.date}T${String(startHour + Math.floor(finalMinuteCount / 60)).padStart(2, "0")}:${String(finalMinuteCount % 60).padStart(2, "0")}:00`,
    answers,
  };
}

export const teacherClassAnalyticsMockExams: TeacherExam[] = analyticsExams.map(
  mapLegacyExamToTeacherExam,
);
export const teacherClassAnalyticsMockResults: ExamResult[] =
  analyticsExams.flatMap((exam, examIndex) =>
    analyticsStudents.map((student, studentIndex) =>
      buildCompletedExamResult(exam, examIndex, student, studentIndex),
    ),
  );
