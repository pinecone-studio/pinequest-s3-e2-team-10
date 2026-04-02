"use client";

import Image from "next/image";
import { Clock3, QrCode } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { CreatedExam } from "@/lib/exams-api";

type QuestionProgressItem = {
  answered: number;
  id: string;
  label: string;
  percent: number;
  question: string;
};

export function ExamMonitoringHeader({
  exam,
  inProgressStudents,
  qrCodeUrl,
  submittedStudents,
  suspiciousActivities,
  timeRemaining,
}: {
  exam: CreatedExam;
  inProgressStudents: number;
  qrCodeUrl: string;
  submittedStudents: number;
  suspiciousActivities: number;
  timeRemaining: string;
}) {
  return (
    <div className="grid gap-6 border-b border-slate-200/80 pb-6 xl:grid-cols-[120px_minmax(0,1fr)_260px] xl:items-start">
      <div className="flex justify-start xl:justify-center">
        <Dialog>
          <DialogTrigger asChild>
            <button type="button" className="group flex flex-col items-center gap-2">
              <div className="flex h-[104px] w-[104px] items-center justify-center rounded-[18px] border border-slate-200 bg-white shadow-[0_12px_30px_rgba(125,163,214,0.12)] transition-transform group-hover:scale-[1.02]">
                <Image
                  src={qrCodeUrl}
                  alt="Exam QR Code"
                  width={88}
                  height={88}
                  className="rounded-none"
                  unoptimized
                />
              </div>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                <QrCode className="h-3.5 w-3.5" />
                Томруулах
              </span>
            </button>
          </DialogTrigger>
          <DialogContent className="max-w-[420px] rounded-[28px] p-8 text-center">
            <DialogTitle className="text-center text-lg text-slate-950">
              Шалгалтанд нэвтрэх QR
            </DialogTitle>
            <div className="mt-2 flex justify-center">
              <div className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-[0_18px_36px_rgba(125,163,214,0.18)]">
                <Image
                  src={qrCodeUrl}
                  alt="Large Exam QR Code"
                  width={280}
                  height={280}
                  className="rounded-none"
                  unoptimized
                />
              </div>
            </div>
            <p className="text-sm leading-6 text-slate-500">
              Сурагч QR уншуулаад нэвтэрсний дараа шууд шалгалт руу орно.
            </p>
          </DialogContent>
        </Dialog>
      </div>

      <div className="space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-400">
            Шалгалтын мэдээлэл
          </p>
          <h2 className="text-[1.9rem] font-semibold tracking-[-0.03em] text-slate-950">
            {exam.title}
          </h2>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500">
          <span>{exam.questions.length} асуулт</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>{submittedStudents} илгээсэн</span>
          <span className="h-1 w-1 rounded-full bg-slate-300" />
          <span>{suspiciousActivities} анхааруулга</span>
        </div>
      </div>

      <div className="space-y-4 xl:justify-self-end xl:text-right">
        <div>
          <p className="inline-flex items-center gap-2 text-xs font-medium uppercase tracking-[0.16em] text-slate-400 xl:justify-end">
            <Clock3 className="h-4 w-4" />
            Үлдсэн хугацаа
          </p>
          <p className="mt-2 text-3xl font-semibold tracking-[0.12em] text-slate-950">
            {timeRemaining}
          </p>
        </div>
        <div className="text-sm text-slate-500">
          Явж буй: <span className="font-medium text-slate-800">{inProgressStudents}</span>
        </div>
      </div>
    </div>
  );
}

export function QuestionProgressCard({
  joinedStudents,
  progress,
  totalStudents,
}: {
  joinedStudents: number;
  progress: QuestionProgressItem[];
  totalStudents: number;
}) {
  return (
    <Card className="rounded-[28px] border-slate-200 bg-white py-0">
      <CardHeader className="border-b border-slate-200/80 py-5">
        <CardTitle>Асуултын явц</CardTitle>
        <CardDescription>
          Сурагчид асуулт бүр дээр хэдэн хувьтай хүрснийг харуулна
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 px-6 py-6">
        {progress.map((item) => (
          <div key={item.id} className="grid gap-2 md:grid-cols-[92px_minmax(0,1fr)_84px] md:items-center">
            <div className="text-sm font-medium text-slate-700">{item.label}</div>
            <div>
              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-[linear-gradient(90deg,#38bdf8_0%,#2563eb_100%)] transition-all"
                  style={{ width: `${Math.max(item.percent, item.answered > 0 ? 6 : 0)}%` }}
                />
              </div>
              <p className="mt-1 truncate text-xs text-slate-400">{item.question}</p>
            </div>
            <div className="text-sm text-slate-500 md:text-right">
              {item.answered}/{joinedStudents || totalStudents || 0}
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
