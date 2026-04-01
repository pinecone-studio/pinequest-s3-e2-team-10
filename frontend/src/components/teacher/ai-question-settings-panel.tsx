"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AIQuestionTypeCounts } from "@/components/teacher/ai-question-generator-dialog-types";

type AIQuestionSettingsPanelProps = {
  difficulty: "easy" | "standard" | "hard";
  onDifficultyChange: (value: "easy" | "standard" | "hard") => void;
  onQuestionTypeCountChange: (
    type: keyof AIQuestionTypeCounts,
    value: number,
  ) => void;
  onVariantsChange: (value: number) => void;
  questionTypeCounts: AIQuestionTypeCounts;
  totalQuestionCount: number;
  variants: number;
};

const questionTypeOptions: Array<{
  key: keyof AIQuestionTypeCounts;
  label: string;
}> = [
  { key: "multipleChoice", label: "Сонгох хариулттай" },
  { key: "trueFalse", label: "Үнэн / худал" },
  { key: "matching", label: "Харгалзуулах" },
  { key: "ordering", label: "Дараалуулах" },
  { key: "shortAnswer", label: "Богино хариулт" },
];

export function AIQuestionSettingsPanel({
  difficulty,
  onDifficultyChange,
  onQuestionTypeCountChange,
  onVariantsChange,
  questionTypeCounts,
  totalQuestionCount,
  variants,
}: AIQuestionSettingsPanelProps) {
  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label>Нийт хэдэн асуулт бэлдүүлэх вэ?</Label>
        <div className="flex h-11 items-center rounded-md border bg-muted px-3 text-sm font-medium">
          {totalQuestionCount}
        </div>
      </div>

      <div className="space-y-2">
        <Label>Асуултын төрөл</Label>
        <div className="grid gap-3 md:grid-cols-2">
          {questionTypeOptions.map((option) => (
            <div key={option.key} className="flex items-center justify-between gap-3 rounded-lg border p-3">
              <Label className="text-sm">{option.label}</Label>
              <Input
                type="number"
                min="0"
                value={questionTypeCounts[option.key]}
                onChange={(event) =>
                  onQuestionTypeCountChange(
                    option.key,
                    parseInt(event.target.value) || 0,
                  )
                }
                className="h-9 w-24"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Хувилбарын тоо</Label>
          <Select
            value={variants.toString()}
            onValueChange={(value) => onVariantsChange(parseInt(value))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1">1 хувилбар</SelectItem>
              <SelectItem value="2">2 хувилбар</SelectItem>
              <SelectItem value="3">3 хувилбар</SelectItem>
              <SelectItem value="4">4 хувилбар</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Түвшин</Label>
          <Select value={difficulty} onValueChange={onDifficultyChange}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Хөнгөн</SelectItem>
              <SelectItem value="standard">Дунд</SelectItem>
              <SelectItem value="hard">Хэцүү</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-lg bg-muted p-4">
        <div className="flex items-center justify-between text-sm">
          <span>Нийт үүсэх асуулт</span>
          <span className="font-medium">
            {totalQuestionCount * variants} ({totalQuestionCount} × {variants} хувилбар)
          </span>
        </div>
      </div>
    </div>
  );
}
