"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mockTests } from "@/lib/mock-data";

export function MockTestSelector({
  onToggleTest,
  selectedMockTests,
}: {
  onToggleTest: (testId: string, checked: boolean) => void;
  selectedMockTests: string[];
}) {
  return (
    <div className="space-y-2">
      <Label>ÐÑÑƒÑƒÐ»Ñ‚Ñ‹Ð½ ÑÐ°Ð½Ð³Ð°Ð°Ñ Ð°Ð³ÑƒÑƒÐ»Ð³Ð° ÑÐ¾Ð½Ð³Ð¾Ñ…</Label>
      <div className="space-y-2 max-h-32 overflow-auto rounded border p-2">
        {mockTests.map((test) => (
          <div key={test.id} className="flex items-center gap-2">
            <Checkbox
              id={test.id}
              checked={selectedMockTests.includes(test.id)}
              onCheckedChange={(checked) =>
                onToggleTest(test.id, Boolean(checked))
              }
            />
            <label htmlFor={test.id} className="text-sm">
              {test.name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
}

export function SourceFilePicker({
  isDragging,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileSelect,
  onRemoveSourceFile,
  selectedSourceFiles,
}: {
  isDragging: boolean;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveSourceFile: (fileName: string) => void;
  selectedSourceFiles: File[];
}) {
  const dropzoneClassName = isDragging
    ? "border-2 border-dashed rounded-lg border-primary bg-primary/5 p-6 text-center transition-colors"
    : "border-2 border-dashed rounded-lg border-muted-foreground/25 p-6 text-center transition-colors";

  return (
    <div className="space-y-2">
      <Label>AI-Ð´ Ð°ÑˆÐ¸Ð³Ð»Ð°Ñ… Ó©Ó©Ñ€ Ñ„Ð°Ð¹Ð» Ð½ÑÐ¼ÑÑ…</Label>
      <div
        className={dropzoneClassName}
        onDragLeave={onDragLeave}
        onDragOver={onDragOver}
        onDrop={onDrop}
      >
        <p className="mb-2 text-sm text-muted-foreground">
          PDF ÑÑÐ²ÑÐ» Word Ñ„Ð°Ð¹Ð»Ð°Ð° ÑÐ½Ð´ Ð¾Ñ€ÑƒÑƒÐ»Ð½Ð° ÑƒÑƒ.
        </p>
        <label htmlFor="ai-source-files">
          <Button variant="outline" asChild>
            <span>Ð­Ñ… Ñ„Ð°Ð¹Ð» Ð½ÑÐ¼ÑÑ…</span>
          </Button>
        </label>
        <input
          id="ai-source-files"
          type="file"
          accept=".pdf,.doc,.docx"
          className="hidden"
          multiple
          onChange={onFileSelect}
        />
      </div>
      {selectedSourceFiles.length > 0 ? (
        <div className="space-y-2 rounded-lg border p-3">
          {selectedSourceFiles.map((file) => (
            <div
              key={`${file.name}-${file.size}`}
              className="flex items-center justify-between gap-3"
            >
              <div>
                <div className="text-sm font-medium">{file.name}</div>
                <div className="text-xs text-muted-foreground">
                  {(file.size / 1024).toFixed(1)} KB
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onRemoveSourceFile(file.name)}
              >
                Ð£ÑÑ‚Ð³Ð°Ñ…
              </Button>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}

export function QuestionCountGrid({
  aiMCCount,
  aiShortCount,
  aiTFCount,
  setAiMCCount,
  setAiShortCount,
  setAiTFCount,
}: {
  aiMCCount: number;
  aiShortCount: number;
  aiTFCount: number;
  setAiMCCount: (value: number) => void;
  setAiShortCount: (value: number) => void;
  setAiTFCount: (value: number) => void;
}) {
  const totalQuestions = aiMCCount + aiTFCount + aiShortCount;

  return (
    <div className="grid grid-cols-2 gap-4">
      <CountField
        label="Ð¡Ð¾Ð½Ð³Ð¾Ñ… Ñ…Ð°Ñ€Ð¸ÑƒÐ»Ñ‚Ñ‚Ð°Ð¹"
        value={aiMCCount}
        onChange={setAiMCCount}
      />
      <CountField
        label="Ò®Ð½ÑÐ½/Ð¥ÑƒÐ´Ð°Ð»"
        value={aiTFCount}
        onChange={setAiTFCount}
      />
      <CountField
        label="Ð‘Ð¾Ð³Ð¸Ð½Ð¾ Ñ…Ð°Ñ€Ð¸ÑƒÐ»Ñ‚"
        value={aiShortCount}
        onChange={setAiShortCount}
      />
      <div className="space-y-2">
        <Label>ÐÐ¸Ð¹Ñ‚ Ð°ÑÑƒÑƒÐ»Ñ‚</Label>
        <div className="flex h-9 items-center rounded-md border bg-muted px-3">
          {totalQuestions}
        </div>
      </div>
    </div>
  );
}

function CountField({
  label,
  onChange,
  value,
}: {
  label: string;
  onChange: (value: number) => void;
  value: number;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input
        min={0}
        type="number"
        value={value}
        onChange={(e) =>
          onChange(Math.max(0, parseInt(e.target.value, 10) || 0))
        }
      />
    </div>
  );
}
