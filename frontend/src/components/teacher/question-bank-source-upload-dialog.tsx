"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type Props = {
  isOpen: boolean;
  isUploading: boolean;
  newSourceName: string;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onNameChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
  onUpload: () => void;
  selectedSourceFile: File | null;
};

function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const unit = Math.floor(Math.log(bytes) / Math.log(1024));
  const sizes = ["Bytes", "KB", "MB", "GB"];
  return `${parseFloat((bytes / 1024 ** unit).toFixed(2))} ${sizes[unit]}`;
}

export function QuestionBankSourceUploadDialog({
  isOpen,
  isUploading,
  newSourceName,
  onFileSelect,
  onNameChange,
  onOpenChange,
  onUpload,
  selectedSourceFile,
}: Props) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Шинэ эх сурвалж файл</DialogTitle>
          <DialogDescription>
            Файлын нэр болон файлаа оруулаад шууд эх сурвалждаа нэмнэ.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="source-name">
              Нэр
            </label>
            <Input
              id="source-name"
              placeholder="Жишээ: 9-р ангийн нийгэм"
              value={newSourceName}
              onChange={(event) => onNameChange(event.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="source-file">
              Файл
            </label>
            <Input
              id="source-file"
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={onFileSelect}
            />
          </div>

          {selectedSourceFile ? (
            <div className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">
              {selectedSourceFile.name} ({formatFileSize(selectedSourceFile.size)})
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Болих
          </Button>
          <Button
            onClick={onUpload}
            disabled={!selectedSourceFile || !newSourceName.trim() || isUploading}
          >
            {isUploading ? "Нэмж байна..." : "Эх сурвалж нэмэх"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
