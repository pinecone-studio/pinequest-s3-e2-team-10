"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle, Clock, Eye, QrCode, Users } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import type { StudentAttempt } from "@/hooks/use-exam-monitoring";
import type { CreatedExam } from "@/lib/exams-api";

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
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(examUrl)}`;
  const inProgressStudents = attempts.filter((attempt) => attempt.status === "in_progress").length;

  return (
    <>
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <MonitoringStat icon={<Users className="h-4 w-4 text-muted-foreground" />} label="ÃÂÃÂ¸ÃÂ¹Ã‘â€š Ã‘ÂÃ‘Æ’Ã‘â‚¬ÃÂ°ÃÂ³Ã‘â€¡" value={totalStudents} />
        <MonitoringStat icon={<CheckCircle className="h-4 w-4 text-green-600" />} label="ÃÂÃ‘ÂÃÂ²Ã‘â€šÃ‘ÂÃ‘â‚¬Ã‘ÂÃ‘ÂÃÂ½" value={joinedStudents} />
        <MonitoringStat icon={<Eye className="h-4 w-4 text-blue-600" />} label="ÃÂ¯ÃÂ²ÃÂ°ÃÂ³ÃÂ´ÃÂ°ÃÂ¶ ÃÂ±ÃÂ°ÃÂ¹ÃÂ½ÃÂ°" value={inProgressStudents} />
        <MonitoringStat icon={<Clock className="h-4 w-4 text-orange-600" />} label="Ã’Â®ÃÂ»ÃÂ´Ã‘ÂÃ‘ÂÃÂ½ Ã‘â€¦Ã‘Æ’ÃÂ³ÃÂ°Ã‘â€ ÃÂ°ÃÂ°" value={timeRemaining} />
        <MonitoringStat icon={<AlertTriangle className="h-4 w-4 text-red-600" />} label="ÃÂ¡Ã‘ÂÃÂ¶ÃÂ¸ÃÂ³Ã‘â€šÃ‘ÂÃÂ¹ Ã’Â¯ÃÂ¹ÃÂ»ÃÂ´Ã‘ÂÃÂ»" value={suspiciousActivities} />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><QrCode className="h-5 w-5" />ÃÂ¨ÃÂ°ÃÂ»ÃÂ³ÃÂ°ÃÂ»Ã‘â€šÃÂ°ÃÂ½ÃÂ´ ÃÂ½Ã‘ÂÃÂ²Ã‘â€šÃ‘â‚¬Ã‘ÂÃ‘â€¦</CardTitle>
            <CardDescription>ÃÂ¡Ã‘Æ’Ã‘â‚¬ÃÂ°ÃÂ³Ã‘â€¡ÃÂ¸ÃÂ´ Ã‘ÂÃÂ½Ã‘Â QR ÃÂºÃÂ¾ÃÂ´Ã‘â€¹ÃÂ³ Ã‘Æ’ÃÂ½Ã‘Ë†Ã‘Æ’Ã‘Æ’ÃÂ»ÃÂ¶ Ã‘Ë†ÃÂ°ÃÂ»ÃÂ³ÃÂ°ÃÂ»Ã‘â€šÃÂ°ÃÂ½ÃÂ´ ÃÂ½Ã‘ÂÃÂ²Ã‘â€šÃ‘ÂÃ‘â‚¬ÃÂ½Ã‘Â</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex justify-center">
              <Image src={qrCodeUrl} alt="Exam QR Code" width={192} height={192} className="rounded-lg border" unoptimized />
            </div>
            <p className="mt-4 text-center text-xs text-muted-foreground">ÃÂ­Ã‘ÂÃÂ²Ã‘ÂÃÂ» ÃÂ»ÃÂ¸ÃÂ½ÃÂº: {examUrl}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ÃÂÃ‘ÂÃ‘Æ’Ã‘Æ’ÃÂ»Ã‘â€šÃ‘â€¹ÃÂ½ Ã‘ÂÃ‘â€šÃÂ°Ã‘â€šÃÂ¸Ã‘ÂÃ‘â€šÃÂ¸ÃÂº</CardTitle>
            <CardDescription>Ãâ€˜ÃÂ¾ÃÂ´ÃÂ¸Ã‘â€š Ã‘â€ ÃÂ°ÃÂ³ ÃÂ´ÃÂ°Ã‘â€¦Ã‘Å’ Ã‘â€¦ÃÂ°Ã‘â‚¬ÃÂ¸Ã‘Æ’ÃÂ»Ã‘â€šÃ‘â€¹ÃÂ½ Ã‘ÂÃ‘â€šÃÂ°Ã‘â€šÃÂ¸Ã‘ÂÃ‘â€šÃÂ¸ÃÂº</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {exam.questions.slice(0, 5).map((question, index) => {
                const progress = getQuestionProgress(index);
                const answered = getAnsweredCount(index, joinedStudents);

                return (
                  <div key={question.id} className="flex items-center justify-between">
                    <span className="text-sm">ÃÂÃ‘ÂÃ‘Æ’Ã‘Æ’ÃÂ»Ã‘â€š {index + 1}</span>
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-20 rounded-full bg-gray-200">
                        <div className="h-2 rounded-full bg-green-600" style={{ width: `${progress}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{answered}/{joinedStudents}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>ÃÂ¡Ã‘Æ’Ã‘â‚¬ÃÂ°ÃÂ³Ã‘â€¡ÃÂ¸ÃÂ´ ({attempts.length})</CardTitle>
            <CardDescription>Ãâ€˜ÃÂ¾ÃÂ´ÃÂ¸Ã‘â€š Ã‘â€ ÃÂ°ÃÂ³ ÃÂ´ÃÂ°Ã‘â€¦Ã‘Å’ Ã‘ÂÃ‘Æ’Ã‘â‚¬ÃÂ°ÃÂ³Ã‘â€¡ÃÂ´Ã‘â€¹ÃÂ½ Ã‘â€šÃ“Â©ÃÂ»Ã“Â©ÃÂ²</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="max-h-96 space-y-3 overflow-y-auto">
              {attempts.map((attempt) => (
                <div key={attempt.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="font-medium">{attempt.studentName}</p>
                    <p className="text-sm text-muted-foreground">
                      {attempt.classId} Ã¢â‚¬Â¢ ÃÂÃ‘ÂÃ‘Æ’Ã‘Æ’ÃÂ»Ã‘â€š {attempt.currentQuestion}/{exam.questions.length}
                    </p>
                  </div>
                  <AttemptStatusBadge status={attempt.status} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {suspiciousActivities > 0 && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            {suspiciousActivities} Ã‘ÂÃ‘Æ’Ã‘â‚¬ÃÂ°ÃÂ³Ã‘â€¡ Ã‘ÂÃ‘ÂÃÂ¶ÃÂ¸ÃÂ³Ã‘â€šÃ‘ÂÃÂ¹ Ã’Â¯ÃÂ¹ÃÂ»ÃÂ´Ã‘ÂÃÂ» Ã‘â€¦ÃÂ¸ÃÂ¹Ã‘ÂÃ‘ÂÃÂ½ (Ã‘â€šÃÂ°ÃÂ± Ã‘ÂÃ‘ÂÃÂ²Ã‘ÂÃÂ» ÃÂ°ÃÂ¿ÃÂ¿ Ã‘ÂÃÂ¾ÃÂ»Ã‘Å’Ã‘ÂÃÂ¾ÃÂ½).
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}

function MonitoringStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: number | string;
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center gap-2">{icon}<div><p className="text-2xl font-bold">{value}</p><p className="text-xs text-muted-foreground">{label}</p></div></div>
      </CardContent>
    </Card>
  );
}

function AttemptStatusBadge({ status }: { status: StudentAttempt["status"] }) {
  if (status === "joined") {
    return <Badge variant="secondary" className="bg-blue-100 text-blue-800">ÃÂÃ‘ÂÃÂ²Ã‘â€šÃ‘ÂÃ‘â‚¬Ã‘ÂÃ‘ÂÃÂ½</Badge>;
  }
  if (status === "in_progress") {
    return <Badge variant="default" className="bg-green-100 text-green-800">ÃÂ¯ÃÂ²ÃÂ°ÃÂ³ÃÂ´ÃÂ°ÃÂ¶ ÃÂ±ÃÂ°ÃÂ¹ÃÂ½ÃÂ°</Badge>;
  }
  if (status === "submitted") {
    return <Badge variant="secondary" className="bg-gray-100 text-gray-800">Ãâ€Ã‘Æ’Ã‘Æ’Ã‘ÂÃ‘ÂÃÂ°ÃÂ½</Badge>;
  }
  if (status === "tab_switched") {
    return <Badge variant="destructive">ÃÂ¢ÃÂ°ÃÂ± Ã‘ÂÃÂ¾ÃÂ»Ã‘Å’Ã‘ÂÃÂ¾ÃÂ½</Badge>;
  }
  return <Badge variant="destructive">ÃÂÃÂ¿ÃÂ¿ Ã‘ÂÃÂ¾ÃÂ»Ã‘Å’Ã‘ÂÃÂ¾ÃÂ½</Badge>;
}

function getQuestionProgress(index: number) {
  return Math.min(92, 28 + index * 14);
}

function getAnsweredCount(index: number, joinedStudents: number) {
  if (joinedStudents <= 0) return 0;
  return Math.min(joinedStudents, Math.max(1, joinedStudents - index));
}
