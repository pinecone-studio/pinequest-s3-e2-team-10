"use client";

import type { StudentAttempt } from "@/hooks/use-exam-monitoring";
import type { CreatedExam } from "@/lib/exams-api";
import {
  ExamMonitoringHeader,
  QuestionProgressCard,
} from "@/components/teacher/exam-monitoring-summary-card";
import {
  StudentStatusCard,
  WarningLogCard,
} from "@/components/teacher/exam-monitoring-roster-card";

export function ExamMonitoringDashboard({
  attempts,
  exam,
  examUrl,
  joinedStudents,
  suspiciousActivities,
  timeRemaining,
  totalStudents,
}: {
  attempts: StudentAttempt[];
  exam: CreatedExam;
  examUrl: string;
  joinedStudents: number;
  suspiciousActivities: number;
  timeRemaining: string;
  totalStudents: number;
}) {
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&data=${encodeURIComponent(examUrl)}`;
  const inProgressStudents = attempts.filter((attempt) => attempt.status === "in_progress").length;
  const submittedStudents = attempts.filter((attempt) => attempt.status === "submitted").length;
  const warningAttempts = attempts.filter(
    (attempt) =>
      attempt.status === "tab_switched" || attempt.status === "app_switched",
  );
  const questionProgress = exam.questions.map((question, index) => {
    const answered = attempts.filter((attempt) => attempt.currentQuestion > index).length;
    const ratio = joinedStudents > 0 ? answered / joinedStudents : 0;

    return {
      answered,
      id: question.id,
      label: `Асуулт ${index + 1}`,
      percent: Math.round(ratio * 100),
      question: question.question,
    };
  });

  return (
    <div className="space-y-6">
      <ExamMonitoringHeader
        exam={exam}
        inProgressStudents={inProgressStudents}
        qrCodeUrl={qrCodeUrl}
        submittedStudents={submittedStudents}
        suspiciousActivities={suspiciousActivities}
        timeRemaining={timeRemaining}
      />

      <div className="grid gap-6 xl:grid-cols-[1.45fr_0.95fr]">
        <QuestionProgressCard
          joinedStudents={joinedStudents}
          progress={questionProgress}
          totalStudents={totalStudents}
        />

        <div className="space-y-6">
          <StudentStatusCard
            attempts={attempts}
            exam={exam}
            joinedStudents={joinedStudents}
            totalStudents={totalStudents}
          />
          <WarningLogCard attempts={warningAttempts} />
        </div>
      </div>
    </div>
  );
}
