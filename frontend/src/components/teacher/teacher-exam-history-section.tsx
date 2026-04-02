"use client";

import * as React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { classes } from "@/lib/mock-data";
import type { TeacherExam } from "@/lib/teacher-exams";
import type { DateRange } from "react-day-picker";
import { TeacherExamHistoryControls } from "@/components/teacher/teacher-exam-history-controls";
import { getDemoClassLabel } from "@/lib/teacher-class-detail";

const ALL_CLASSES_VALUE = "all";

export function TeacherExamHistorySection({
  emptyLabel,
  exams,
  title,
}: {
  emptyLabel: string;
  exams: TeacherExam[];
  title: string;
}) {
  const [nameQuery, setNameQuery] = React.useState("");
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>();
  const [selectedClass, setSelectedClass] = React.useState(ALL_CLASSES_VALUE);

  const classOptions = React.useMemo(() => {
    const scheduledClassIds = new Set(
      exams.flatMap((exam) => exam.scheduledClasses.map((schedule) => schedule.classId)),
    );

    return classes.filter((classEntry) => scheduledClassIds.has(classEntry.id));
  }, [exams]);

  const filteredExams = React.useMemo(() => {
    const normalizedQuery = nameQuery.trim().toLowerCase();

    return exams.filter((exam) => {
      const matchesName =
        normalizedQuery.length === 0 ||
        exam.title.toLowerCase().includes(normalizedQuery);
      const matchesClass =
        selectedClass === ALL_CLASSES_VALUE ||
        exam.scheduledClasses.some((schedule) => schedule.classId === selectedClass);
      const matchesDate = exam.scheduledClasses.some((schedule) =>
        isDateWithinRange(schedule.date, dateRange),
      );

      return matchesName && matchesClass && matchesDate;
    });
  }, [dateRange, exams, nameQuery, selectedClass]);

  return (
    <section className="mt-10 space-y-4 border-t border-slate-200 pt-8">
      <h2 className="text-lg font-semibold text-slate-950">{title}</h2>

      <TeacherExamHistoryControls
        classOptions={classOptions.map((classEntry) => ({
          label: classEntry.name.replace(" анги", ""),
          value: classEntry.id,
        }))}
        dateRange={dateRange}
        filteredExamCount={filteredExams.length}
        nameQuery={nameQuery}
        onClassChange={setSelectedClass}
        onDateRangeChange={setDateRange}
        onNameQueryChange={setNameQuery}
        selectedClass={selectedClass}
      />

      {filteredExams.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50/80 px-6 py-8 text-center text-sm text-muted-foreground">
          {emptyLabel}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredExams.map((exam) => (
            <article
              key={exam.id}
              className="rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-[0_8px_30px_rgba(15,23,42,0.05)]"
            >
              <div className="grid gap-3 lg:grid-cols-[minmax(0,1.6fr)_220px_220px_160px] lg:items-center">
                <h3 className="truncate text-sm font-semibold text-slate-950">
                  {exam.title}
                </h3>
                <p className="text-sm text-slate-600">
                  {formatExamDateSummary(exam)}
                </p>
                <p className="truncate text-sm text-slate-600">
                  {formatExamClassSummary(exam)}
                </p>
                <div className="flex justify-start lg:justify-end">
                  <Button asChild size="sm">
                    <Link href={buildHistoryReviewLink(exam)}>
                      Үр дүн, үнэлгээ
                    </Link>
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

function buildHistoryReviewLink(exam: TeacherExam) {
  const firstSchedule = exam.scheduledClasses[0];
  return firstSchedule
    ? `/teacher/classes?classId=${firstSchedule.classId}&examId=${exam.id}`
    : `/teacher/exams/${exam.id}/monitoring`;
}

function formatExamDateSummary(exam: TeacherExam) {
  const timestamps = exam.scheduledClasses
    .map((schedule) => new Date(`${schedule.date}T00:00:00`))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((left, right) => left.getTime() - right.getTime());

  if (timestamps.length === 0) {
    return "Огноо байхгүй";
  }

  const first = timestamps[0];
  const last = timestamps[timestamps.length - 1];

  if (first.getTime() === last.getTime()) {
    return formatDisplayDate(first);
  }

  return `${formatDisplayDate(first)} - ${formatDisplayDate(last)}`;
}

function formatExamClassSummary(exam: TeacherExam) {
  const classIds = Array.from(
    new Set(exam.scheduledClasses.map((schedule) => schedule.classId)),
  );

  return classIds
    .map(getDemoClassLabel)
    .join(", ");
}

function isDateWithinRange(dateString: string, dateRange?: DateRange) {
  if (!dateRange?.from && !dateRange?.to) {
    return true;
  }

  const examDate = new Date(`${dateString}T00:00:00`);

  if (Number.isNaN(examDate.getTime())) {
    return false;
  }

  const from = dateRange.from ? startOfDay(dateRange.from) : null;
  const to = dateRange.to ? endOfDay(dateRange.to) : null;

  if (from && examDate < from) {
    return false;
  }

  if (to && examDate > to) {
    return false;
  }

  return true;
}

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function endOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999);
}

function formatDisplayDate(date: Date) {
  return new Intl.DateTimeFormat("mn-MN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}
