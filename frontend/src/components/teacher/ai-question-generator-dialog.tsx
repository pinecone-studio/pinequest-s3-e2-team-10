"use client";

import { useState, type ChangeEvent, type DragEvent } from "react";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { UploadRecord } from "@/lib/uploads-api";
import { FileText, X } from "lucide-react";

interface SourceFileWithPages {
  file: File;
  startPage: number;
  endPage: number;
}

type QuestionGeneratorPayload = {
  sourceFilesWithPages: SourceFileWithPages[];
  aiMCCount: number;
  aiTFCount: number;
  aiShortCount: number;
  variants: number;
  difficulty: "easy" | "standard" | "hard";
  category: string;
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

type BuilderDialogProps = SharedProps & {
  aiMCCount: number;
  aiTFCount: number;
  aiShortCount: number;
  isDragging: boolean;
  onDragLeave: (event: DragEvent<HTMLDivElement>) => void;
  onDragOver: (event: DragEvent<HTMLDivElement>) => void;
  onDrop: (event: DragEvent<HTMLDivElement>) => void;
  onFileSelect: (event: ChangeEvent<HTMLInputElement>) => void;
  onGenerate: () => void | Promise<void>;
  onRemoveSourceFile: (fileName: string) => void;
  selectedSourceFiles: File[];
  setAiMCCount: (value: number) => void;
  setAiTFCount: (value: number) => void;
  setAiShortCount: (value: number) => void;
};

type QuestionBankDialogProps = SharedProps & {
  onGenerate: (payload: QuestionGeneratorPayload) => void | Promise<void>;
};

type AIQuestionGeneratorDialogProps =
  | BuilderDialogProps
  | QuestionBankDialogProps;

function isBuilderDialogProps(
  props: AIQuestionGeneratorDialogProps,
): props is BuilderDialogProps {
  return "selectedSourceFiles" in props;
}

export function AIQuestionGeneratorDialog(
  props: AIQuestionGeneratorDialogProps,
) {
  const { isGenerating, onOpenChange, open, selectedMockTests } = props;
  const availableSourceFiles = props.availableSourceFiles ?? [];
  const [sourceFilesWithPages, setSourceFilesWithPages] = useState<
    SourceFileWithPages[]
  >([]);
  const [localAiMCCount, setLocalAiMCCount] = useState(0);
  const [localAiTFCount, setLocalAiTFCount] = useState(0);
  const [localAiShortCount, setLocalAiShortCount] = useState(0);
  const [variants, setVariants] = useState(1);
  const [difficulty, setDifficulty] = useState<"easy" | "standard" | "hard">(
    "standard",
  );
  const [category, setCategory] = useState("");
  const [localIsDragging, setLocalIsDragging] = useState(false);

  const isBuilderDialog = isBuilderDialogProps(props);
  const aiMCCount = isBuilderDialog ? props.aiMCCount : localAiMCCount;
  const aiTFCount = isBuilderDialog ? props.aiTFCount : localAiTFCount;
  const aiShortCount = isBuilderDialog ? props.aiShortCount : localAiShortCount;
  const selectedSourceFiles = isBuilderDialog ? props.selectedSourceFiles : [];
  const isDragging = isBuilderDialog ? props.isDragging : localIsDragging;
  const hasSource = isBuilderDialog
    ? selectedMockTests.length > 0 || selectedSourceFiles.length > 0
    : selectedMockTests.length > 0 || sourceFilesWithPages.length > 0;

  const submit = () => {
    if (isBuilderDialog) {
      void props.onGenerate();
      return;
    }

    void props.onGenerate({
      sourceFilesWithPages,
      aiMCCount,
      aiTFCount,
      aiShortCount,
      variants,
      difficulty,
      category,
      selectedMockTests,
    });
  };

  const handleFileSelectWithPages = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files);
      const newFilesWithPages = files.map((file) => ({
        file,
        startPage: 1,
        endPage: 10,
      }));
      setSourceFilesWithPages((prev) => [...prev, ...newFilesWithPages]);
    }
    e.target.value = "";
  };

  const updatePageRange = (
    fileName: string,
    field: "startPage" | "endPage",
    value: number,
  ) => {
    setSourceFilesWithPages((prev) =>
      prev.map((item) =>
        item.file.name === fileName ? { ...item, [field]: value } : item,
      ),
    );
  };

  const removeSourceFile = (fileName: string) => {
    setSourceFilesWithPages((prev) =>
      prev.filter((item) => item.file.name !== fileName),
    );
  };

  const totalQuestions = aiMCCount + aiTFCount + aiShortCount;
  const finalQuestionCount = totalQuestions * variants;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>AI ашиглан асуулт үүсгэх</DialogTitle>
          <DialogDescription>
            Медлэгийн сангийн файлууд эсвэл шинэ файл дээр тулгуурлан асуулт
            үүсгэнэ.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Эх сурвалж сонгох</Label>
              <div className="max-h-40 space-y-2 overflow-auto rounded border p-2">
                <p className="text-sm text-muted-foreground">
                  Медлэгийн сангийн файлууд:
                </p>
                {availableSourceFiles.length === 0 ? (
                  <div className="text-sm text-muted-foreground">
                    Медлэгийн санд хараахан файл алга байна.
                  </div>
                ) : (
                  availableSourceFiles.map((source) => (
                    <label
                      key={source.id}
                      className="flex cursor-pointer items-center gap-3 rounded-md px-2 py-1.5 hover:bg-muted"
                    >
                      <Checkbox
                        checked={selectedMockTests.includes(source.id)}
                        onCheckedChange={(checked) =>
                          props.onToggleTest(source.id, checked === true)
                        }
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium">
                          {source.originalName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(source.uploadedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </label>
                  ))
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Эсвэл шинэ файл нэмэх</Label>
              <div
                className={
                  isDragging
                    ? "rounded-lg border-2 border-dashed border-primary bg-primary/5 p-6 text-center transition-colors"
                    : "rounded-lg border-2 border-dashed border-muted-foreground/25 p-6 text-center transition-colors"
                }
                onDragEnter={
                  isBuilderDialog
                    ? props.onDragOver
                    : (e) => {
                        e.preventDefault();
                        setLocalIsDragging(true);
                      }
                }
                onDragOver={
                  isBuilderDialog
                    ? props.onDragOver
                    : (e) => {
                        e.preventDefault();
                        setLocalIsDragging(true);
                      }
                }
                onDragLeave={
                  isBuilderDialog
                    ? props.onDragLeave
                    : () => setLocalIsDragging(false)
                }
                onDrop={
                  isBuilderDialog
                    ? props.onDrop
                    : (e) => {
                        e.preventDefault();
                        setLocalIsDragging(false);
                        const files = Array.from(e.dataTransfer.files);
                        const newFilesWithPages = files.map((file) => ({
                          file,
                          startPage: 1,
                          endPage: 10,
                        }));
                        setSourceFilesWithPages((prev) => [
                          ...prev,
                          ...newFilesWithPages,
                        ]);
                      }
                }
              >
                <p className="mb-2 text-sm text-muted-foreground">
                  PDF файлыг энд чирж оруулна уу
                </p>
                <label htmlFor="ai-source-files">
                  <Button variant="outline" asChild>
                    <span>Файл сонгох</span>
                  </Button>
                </label>
                <input
                  id="ai-source-files"
                  type="file"
                  accept=".pdf"
                  className="hidden"
                  multiple
                  onChange={
                    isBuilderDialog
                      ? props.onFileSelect
                      : handleFileSelectWithPages
                  }
                />
              </div>

              {!isBuilderDialog && sourceFilesWithPages.length > 0 && (
                <div className="space-y-2">
                  {sourceFilesWithPages.map((item) => (
                    <div key={item.file.name} className="rounded-lg border p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {item.file.name}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeSourceFile(item.file.name)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label className="text-xs">Эхлэх хуудас</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.startPage}
                            onChange={(e) =>
                              updatePageRange(
                                item.file.name,
                                "startPage",
                                parseInt(e.target.value) || 1,
                              )
                            }
                            className="h-8"
                          />
                        </div>
                        <div>
                          <Label className="text-xs">Дуусах хуудас</Label>
                          <Input
                            type="number"
                            min="1"
                            value={item.endPage}
                            onChange={(e) =>
                              updatePageRange(
                                item.file.name,
                                "endPage",
                                parseInt(e.target.value) || 1,
                              )
                            }
                            className="h-8"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {isBuilderDialog && selectedSourceFiles.length > 0 && (
                <div className="space-y-2">
                  {selectedSourceFiles.map((file) => (
                    <div
                      key={`${file.name}-${file.size}`}
                      className="rounded-lg border p-3"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {file.name}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => props.onRemoveSourceFile(file.name)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Асуултын төрөл</Label>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Сонгох хариулттай</Label>
                  <Input
                    type="number"
                    min="0"
                    value={aiMCCount}
                    onChange={(e) =>
                      (isBuilderDialog
                        ? props.setAiMCCount
                        : setLocalAiMCCount)(parseInt(e.target.value) || 0)
                    }
                    className="h-8 w-20"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Үнэн/Худал</Label>
                  <Input
                    type="number"
                    min="0"
                    value={aiTFCount}
                    onChange={(e) =>
                      (isBuilderDialog
                        ? props.setAiTFCount
                        : setLocalAiTFCount)(parseInt(e.target.value) || 0)
                    }
                    className="h-8 w-20"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Богино хариулт</Label>
                  <Input
                    type="number"
                    min="0"
                    value={aiShortCount}
                    onChange={(e) =>
                      (isBuilderDialog
                        ? props.setAiShortCount
                        : setLocalAiShortCount)(parseInt(e.target.value) || 0)
                    }
                    className="h-8 w-20"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Асуултын тоо</Label>
              <div className="flex h-9 items-center rounded-md border bg-muted px-3">
                {totalQuestions}
              </div>

              <Label>Хувилбарын тоо</Label>
              <Select
                value={variants.toString()}
                onValueChange={(value) => setVariants(parseInt(value))}
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

              <Label>Түвшин</Label>
              <Select
                value={difficulty}
                onValueChange={(value: "easy" | "standard" | "hard") =>
                  setDifficulty(value)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Хөнгөн</SelectItem>
                  <SelectItem value="standard">Дунд</SelectItem>
                  <SelectItem value="hard">Хэцүү</SelectItem>
                </SelectContent>
              </Select>

              <Label>Ангилал</Label>
              <Input
                placeholder="Жишээ: Математик"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-lg bg-muted p-4">
            <div className="flex items-center justify-between text-sm">
              <span>Нийт асуулт:</span>
              <span className="font-medium">
                {finalQuestionCount} ({totalQuestions} × {variants} хувилбар)
              </span>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Болих
          </Button>
          <Button
            onClick={submit}
            disabled={isGenerating || !hasSource || totalQuestions === 0}
          >
            {isGenerating
              ? "Үүсгэж байна..."
              : `${finalQuestionCount} асуулт үүсгэх`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
