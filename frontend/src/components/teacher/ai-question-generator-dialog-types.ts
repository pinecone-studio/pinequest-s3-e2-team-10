import type { ChangeEvent, DragEvent } from "react";
import type { UploadRecord } from "@/lib/uploads-api";

export interface SourceFileWithPages {
  file: File;
  startPage: number;
  endPage: number;
}

export type AIQuestionTypeCounts = {
  multipleChoice: number;
  trueFalse: number;
  matching: number;
  ordering: number;
  shortAnswer: number;
};

export const defaultAIQuestionTypeCounts: AIQuestionTypeCounts = {
  multipleChoice: 1,
  trueFalse: 1,
  matching: 1,
  ordering: 1,
  shortAnswer: 1,
};

export type QuestionGeneratorPayload = {
  sourceFilesWithPages: SourceFileWithPages[];
  questionTypeCounts: AIQuestionTypeCounts;
  variants: number;
  difficulty: "easy" | "standard" | "hard";
  selectedMockTests: string[];
};

type SharedProps = {
  availableSourceFiles?: UploadRecord[];
  isGenerating: boolean;
  onOpenChange: (open: boolean) => void;
  onToggleTest: (testId: string, checked: boolean) => void;
  open: boolean;
  selectedMockTests: string[];
};

export type BuilderDialogProps = SharedProps & {
  aiQuestionTypeCounts: AIQuestionTypeCounts;
  isDragging: boolean;
  onDragLeave: (event: DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onFileSelect: (event: ChangeEvent<HTMLInputElement>) => void;
  onGenerate: () => void | Promise<void>;
  onRemoveSourceFile: (fileName: string) => void;
  selectedSourceFiles: File[];
  setAiQuestionTypeCounts: (value: AIQuestionTypeCounts) => void;
};

export type QuestionBankDialogProps = SharedProps & {
  onGenerate: (payload: QuestionGeneratorPayload) => void | Promise<void>;
};

export type AIQuestionGeneratorDialogProps =
  | BuilderDialogProps
  | QuestionBankDialogProps;

export function isBuilderDialogProps(
  props: AIQuestionGeneratorDialogProps,
): props is BuilderDialogProps {
  return "selectedSourceFiles" in props;
}
