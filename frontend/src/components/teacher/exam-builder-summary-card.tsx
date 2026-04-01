"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ScheduleEntry } from "@/components/teacher/exam-builder-types";
import { ALL_CLASSES_OPTION } from "@/lib/exams-api";
import { classes, type Exam } from "@/lib/mock-data";

type QuestionCounts = Record<
  "multiple-choice" | "true-false" | "matching" | "ordering" | "short-answer",
  number
>;

export function ExamBuilderSummaryCard({
  duration,
  onAddScheduleEntry,
  onDurationChange,
  onRemoveScheduleEntry,
  onReportReleaseModeChange,
  onScheduleEntryChange,
  questionCounts,
  questionTotal,
  reportReleaseMode,
  scheduleEntries,
  totalPoints,
}: {
  duration: number;
  onAddScheduleEntry: () => void;
  onDurationChange: (value: number) => void;
  onRemoveScheduleEntry: (index: number) => void;
  onReportReleaseModeChange: (value: Exam["reportReleaseMode"]) => void;
  onScheduleEntryChange: (
    index: number,
    field: keyof ScheduleEntry,
    value: string,
  ) => void;
  questionCounts: QuestionCounts;
  questionTotal: number;
  reportReleaseMode: Exam["reportReleaseMode"];
  scheduleEntries: ScheduleEntry[];
  totalPoints: number;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Шалгалтын хураангуй</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-3 xl:grid-cols-5">
          <SummaryStat label="Асуулт" value={questionTotal} />
          <SummaryStat label="Нийт оноо" value={totalPoints} />
          <SummaryStat label="Сонгох хариулттай" value={questionCounts["multiple-choice"]} />
          <SummaryStat label="Үнэн / Худал" value={questionCounts["true-false"]} />
          <SummaryStat label="Харгалзуулах" value={questionCounts["matching"]} />
          <SummaryStat label="Дараалуулах" value={questionCounts["ordering"]} />
          <SummaryStat label="Богино хариулт" value={questionCounts["short-answer"]} />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Хугацаа (минут)
            </Label>
            <Input
              type="number"
              value={duration}
              onChange={(e) => onDurationChange(parseInt(e.target.value) || 60)}
              className="h-11 w-full md:max-w-[220px]"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-foreground">
              Сурагчдад дүн харагдах хугацаа
            </Label>
            <Select
              value={reportReleaseMode}
              onValueChange={(value) =>
                onReportReleaseModeChange(value as Exam["reportReleaseMode"])
              }
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Дүн харагдах хугацааг сонгоно уу" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="after-all-classes-complete">
                  Товлогдсон бүх анги дууссаны дараа
                </SelectItem>
                <SelectItem value="immediately">
                  Сурагч илгээмэгц шууд
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="border-t pt-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="space-y-1">
              <Label className="text-sm font-medium text-foreground">
                Шалгалт товлох
              </Label>
              <p className="text-sm text-muted-foreground">
                Сонголттой. Хоосон орхивол шалгалт бэлэн болсон төлөвт хадгалагдана.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={onAddScheduleEntry}>
              Ангийн хуваарь нэмэх
            </Button>
          </div>

          {scheduleEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Одоогоор анги товлоогүй байна.
            </p>
          ) : (
            <div className="space-y-3">
              {scheduleEntries.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 rounded-lg border p-3"
                >
                  <Select
                    value={entry.classId}
                    onValueChange={(value) =>
                      onScheduleEntryChange(index, "classId", value)
                    }
                  >
                    <SelectTrigger className="h-11 w-40">
                      <SelectValue placeholder="Анги" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_CLASSES_OPTION}>
                        Бүх анги
                      </SelectItem>
                      {classes.map((classEntry) => (
                        <SelectItem key={classEntry.id} value={classEntry.id}>
                          {classEntry.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    type="date"
                    value={entry.date}
                    onChange={(e) =>
                      onScheduleEntryChange(index, "date", e.target.value)
                    }
                    className="h-11 w-40"
                  />
                  <Input
                    type="time"
                    value={entry.time}
                    onChange={(e) =>
                      onScheduleEntryChange(index, "time", e.target.value)
                    }
                    className="h-11 w-32"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveScheduleEntry(index)}
                  >
                    Устгах
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function SummaryStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-muted p-3">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
