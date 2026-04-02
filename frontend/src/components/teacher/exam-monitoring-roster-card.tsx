"use client";

import { ShieldAlert } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { StudentAttempt } from "@/hooks/use-exam-monitoring";
import type { CreatedExam } from "@/lib/exams-api";

export function StudentStatusCard({
  attempts,
  exam,
  joinedStudents,
  totalStudents,
}: {
  attempts: StudentAttempt[];
  exam: CreatedExam;
  joinedStudents: number;
  totalStudents: number;
}) {
  return (
    <Card className="rounded-[28px] border-slate-200 bg-white py-0">
      <CardHeader className="border-b border-slate-200/80 py-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>Сурагчдын төлөв</CardTitle>
            <CardDescription>Шалгалтад орж буй сурагчид</CardDescription>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-sm text-slate-600">
            <span className="font-medium text-slate-950">
              {joinedStudents} / {totalStudents}
            </span>
            <span>сурагч орсон</span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="max-h-[420px] space-y-3 overflow-y-auto px-6 py-6">
        {attempts.length > 0 ? (
          attempts.map((attempt) => (
            <div
              key={attempt.id}
              className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <div className="min-w-0">
                <p className="truncate font-medium text-slate-900">{attempt.studentName}</p>
                <p className="text-sm text-slate-500">
                  {attempt.classId} • {attempt.currentQuestion}/{exam.questions.length} асуулт
                </p>
              </div>
              <AttemptStatusBadge status={attempt.status} />
            </div>
          ))
        ) : (
          <p className="text-sm text-slate-500">Одоогоор холбогдсон сурагч алга.</p>
        )}
      </CardContent>
    </Card>
  );
}

export function WarningLogCard({ attempts }: { attempts: StudentAttempt[] }) {
  return (
    <Card className="rounded-[28px] border-slate-200 bg-white py-0">
      <CardHeader className="border-b border-slate-200/80 py-5">
        <CardTitle>Анхааруулгын бүртгэл</CardTitle>
        <CardDescription>
          Таб солих эсвэл апп солих оролдлогын тэмдэглэл
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3 px-6 py-6">
        {attempts.length > 0 ? (
          attempts.map((attempt) => (
            <Alert
              key={`${attempt.id}-${attempt.status}`}
              variant="destructive"
              className="rounded-2xl border-red-200 bg-red-50/80 text-red-900"
            >
              <ShieldAlert className="h-4 w-4" />
              <AlertTitle>
                {attempt.studentName} ({attempt.classId})
              </AlertTitle>
              <AlertDescription>
                {attempt.status === "tab_switched"
                  ? "Tab switch хийх оролдлого илэрлээ."
                  : "Өөр app руу гарах оролдлого илэрлээ."}
              </AlertDescription>
            </Alert>
          ))
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm text-slate-500">
            Одоогоор warning бүртгэгдээгүй байна.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function AttemptStatusBadge({ status }: { status: StudentAttempt["status"] }) {
  if (status === "joined") {
    return (
      <Badge variant="secondary" className="bg-sky-100 text-sky-700">
        Нэвтэрсэн
      </Badge>
    );
  }
  if (status === "in_progress") {
    return (
      <Badge variant="default" className="bg-emerald-100 text-emerald-700">
        Явж байна
      </Badge>
    );
  }
  if (status === "submitted") {
    return (
      <Badge variant="secondary" className="bg-slate-200 text-slate-700">
        Дууссан
      </Badge>
    );
  }
  if (status === "tab_switched") {
    return <Badge variant="destructive">Таб сольсон</Badge>;
  }
  return <Badge variant="destructive">Апп сольсон</Badge>;
}
