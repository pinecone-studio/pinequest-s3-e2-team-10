import type { Exam } from "@/lib/mock-data-types";
import { examE1 } from "@/lib/mock-exams-seed/exam-e1";
import { examE2 } from "@/lib/mock-exams-seed/exam-e2";
import { examE3 } from "@/lib/mock-exams-seed/exam-e3";
import { examE4 } from "@/lib/mock-exams-seed/exam-e4";
import { examE5 } from "@/lib/mock-exams-seed/exam-e5";
import { examE6 } from "@/lib/mock-exams-seed/exam-e6";

const scheduledMathExams: Exam[] = [
  {
    id: "e7",
    title: "Тэнцэтгэл бишийн давтлага",
    questions: [
      {
        id: "e7q1",
        type: "multiple-choice",
        question: "x + 3 > 7 бол x ямар тоо байх вэ?",
        options: ["4-өөс их", "3-аас бага", "7-той тэнцүү", "1-ээс бага"],
        correctAnswer: "4-өөс их",
        points: 6,
      },
      {
        id: "e7q2",
        type: "true-false",
        question: "x < 5 гэдэг нь 5-аас бага бүх тоог илэрхийлнэ.",
        correctAnswer: "True",
        points: 4,
      },
      {
        id: "e7q3",
        type: "short-answer",
        question: "2x > 10 бол x-ийн хамгийн бага бүхэл шийд хэд вэ?",
        correctAnswer: "6",
        points: 8,
      },
    ],
    duration: 30,
    reportReleaseMode: "after-all-classes-complete",
    scheduledClasses: [{ classId: "10A", date: "2026-03-25", time: "10:00" }],
    createdAt: "2026-03-18",
    status: "scheduled",
  },
  {
    id: "e8",
    title: "Координатын хавтгайн сорил",
    questions: [
      {
        id: "e8q1",
        type: "multiple-choice",
        question: "(0, 4) цэг ямар тэнхлэг дээр байрлах вэ?",
        options: ["x-тэнхлэг", "y-тэнхлэг", "I квадрант", "II квадрант"],
        correctAnswer: "y-тэнхлэг",
        points: 6,
      },
      {
        id: "e8q2",
        type: "true-false",
        question: "(-2, 3) цэг II квадрантад оршино.",
        correctAnswer: "True",
        points: 4,
      },
    ],
    duration: 60,
    reportReleaseMode: "after-all-classes-complete",
    scheduledClasses: [
      { classId: "10A", date: "2026-03-24", time: "11:00" },
      { classId: "10B", date: "2026-03-24", time: "13:00" },
      { classId: "10C", date: "2026-03-24", time: "15:00" },
    ],
    createdAt: "2026-03-20",
    status: "scheduled",
  },
  {
    id: "e4",
    title: "Codex test",
    questions: [
      {
        id: "q11",
        type: "multiple-choice",
        question: "Which tool did we use to update this project?",
        options: ["Codex", "Spreadsheet", "Slide deck", "Email"],
        correctAnswer: "Codex",
        points: 10,
      },
      {
        id: "q12",
        type: "short-answer",
        question: "Write the class name this test is scheduled for.",
        correctAnswer: "10B",
        points: 10,
      },
      {
        id: "q13",
        type: "true-false",
        question: "This test is available for class 10B students.",
        correctAnswer: "True",
        points: 5,
      },
    ],
    duration: 25,
    availableIndefinitely: true,
    reportReleaseMode: "after-all-classes-complete",
    scheduledClasses: [{ classId: "10B", date: "2026-04-03", time: "00:00" }],
    createdAt: "2026-04-03",
    status: "scheduled",
  },
];

export const exams: Exam[] = [
  examE1,
  examE2,
  examE3,
  examE4,
  examE5,
  examE6,
  ...scheduledMathExams,
];
