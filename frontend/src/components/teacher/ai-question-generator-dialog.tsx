"use client";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  MockTestSelector,
  QuestionCountGrid,
  SourceFilePicker,
} from "@/components/teacher/ai-question-generator-dialog-sections";

type AIQuestionGeneratorDialogProps = {
  aiMCCount: number;
  aiShortCount: number;
  aiTFCount: number;
  isGenerating: boolean;
  isDragging: boolean;
  onGenerate: () => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onOpenChange: (open: boolean) => void;
  onRemoveSourceFile: (fileName: string) => void;
  onToggleTest: (testId: string, checked: boolean) => void;
  open: boolean;
  selectedMockTests: string[];
  selectedSourceFiles: File[];
  setAiMCCount: (value: number) => void;
  setAiShortCount: (value: number) => void;
  setAiTFCount: (value: number) => void;
};

export function AIQuestionGeneratorDialog({
  aiMCCount,
  aiShortCount,
  aiTFCount,
  isGenerating,
  isDragging,
  onGenerate,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileSelect,
  onOpenChange,
  onRemoveSourceFile,
  onToggleTest,
  open,
  selectedMockTests,
  selectedSourceFiles,
  setAiMCCount,
  setAiShortCount,
  setAiTFCount,
}: AIQuestionGeneratorDialogProps) {
  const hasSource =
    selectedMockTests.length > 0 || selectedSourceFiles.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>AI Ð°ÑˆÐ¸Ð³Ð»Ð°Ð½ Ð°ÑÑƒÑƒÐ»Ñ‚ Ò¯Ò¯ÑÐ³ÑÑ…</DialogTitle>
          <DialogDescription>
            ÐÑÑƒÑƒÐ»Ñ‚Ñ‹Ð½ ÑÐ°Ð½Ð³Ð¸Ð¹Ð½ Ð¼Ð°Ñ‚ÐµÑ€Ð¸Ð°Ð», ÑˆÐ¸Ð½ÑÑÑ€ Ð¾Ñ€ÑƒÑƒÐ»ÑÐ°Ð½ Ñ„Ð°Ð¹Ð», ÑÑÐ²ÑÐ» Ñ…Ð¾Ñ‘ÑƒÐ»Ð°Ð½Ð³ Ð½ÑŒ
            ÑÑ… ÑÑƒÑ€Ð²Ð°Ð»Ð¶ Ð±Ð¾Ð»Ð³Ð¾Ð½ Ð°ÑˆÐ¸Ð³Ð»Ð°Ñ… Ð±Ð¾Ð»Ð¾Ð¼Ð¶Ñ‚Ð¾Ð¹.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <MockTestSelector
            onToggleTest={onToggleTest}
            selectedMockTests={selectedMockTests}
          />
          <SourceFilePicker
            isDragging={isDragging}
            onDragLeave={onDragLeave}
            onDragOver={onDragOver}
            onDrop={onDrop}
            onFileSelect={onFileSelect}
            onRemoveSourceFile={onRemoveSourceFile}
            selectedSourceFiles={selectedSourceFiles}
          />
          <QuestionCountGrid
            aiMCCount={aiMCCount}
            aiShortCount={aiShortCount}
            aiTFCount={aiTFCount}
            setAiMCCount={setAiMCCount}
            setAiShortCount={setAiShortCount}
            setAiTFCount={setAiTFCount}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Ð‘Ð¾Ð»Ð¸Ñ…
          </Button>
          <Button onClick={onGenerate} disabled={isGenerating || !hasSource}>
            {isGenerating ? "Ò®Ò¯ÑÐ³ÑÐ¶ Ð±Ð°Ð¹Ð½Ð°..." : "ÐÑÑƒÑƒÐ»Ñ‚ Ò¯Ò¯ÑÐ³ÑÑ…"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
