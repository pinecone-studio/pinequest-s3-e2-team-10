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
        <CardTitle>Shalgaltiin huraanguy</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-center md:grid-cols-3 xl:grid-cols-5">
          <SummaryStat label="Asuult" value={questionTotal} />
          <SummaryStat label="Niit onoo" value={totalPoints} />
          <SummaryStat label="Songoh hariulttai" value={questionCounts["multiple-choice"]} />
          <SummaryStat label="Unen / Hudal" value={questionCounts["true-false"]} />
          <SummaryStat label="Matching" value={questionCounts["matching"]} />
          <SummaryStat label="Ordering" value={questionCounts["ordering"]} />
          <SummaryStat label="Bogino hariult" value={questionCounts["short-answer"]} />
        </div>
        <div className="flex items-center gap-4">
          <Label>Hugatsaa (minut)</Label>
          <Input
            type="number"
            value={duration}
            onChange={(e) => onDurationChange(parseInt(e.target.value) || 60)}
            className="w-24"
          />
        </div>

        <div className="space-y-2">
          <Label>Suragchdad shalgaltiin dun haragdah hugatsaa</Label>
          <Select
            value={reportReleaseMode}
            onValueChange={(value) =>
              onReportReleaseModeChange(value as Exam["reportReleaseMode"])
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Shalgaltiin dun haragdah hugatsaag songono uu" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="after-all-classes-complete">
                Tovlogdson buh angi duussanii daraa
              </SelectItem>
              <SelectItem value="immediately">
                Suragch bur ilgeesnii daraa
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="border-t pt-4">
          <div className="mb-3 flex items-center justify-between">
            <Label>Shalgalt tovloh</Label>
            <Button variant="outline" size="sm" onClick={onAddScheduleEntry}>
              Angiin huvaari nemekh
            </Button>
          </div>

          {scheduleEntries.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Odoogoor angi tovlogoogui baina
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
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Angi" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value={ALL_CLASSES_OPTION}>
                        Buh angi
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
                    className="w-40"
                  />
                  <Input
                    type="time"
                    value={entry.time}
                    onChange={(e) =>
                      onScheduleEntryChange(index, "time", e.target.value)
                    }
                    className="w-32"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveScheduleEntry(index)}
                  >
                    Ustgah
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
