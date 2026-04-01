"use client";

import Link from "next/link";
import { useState } from "react";
import { createQuestionBankCategoryAction } from "@/components/teacher/question-bank-actions";
import {
  CREATE_CATEGORY_FILTER_VALUE,
  QuestionBankFiltersCard,
} from "@/components/teacher/question-bank-filters-card";
import {
  TeacherPageHeader,
  TeacherPageShell,
  TeacherSurfaceCard,
} from "@/components/teacher/teacher-page-primitives";
import { QuestionBankResults } from "@/components/teacher/question-bank-results";
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
import { useQuestionBankBuilder } from "@/hooks/use-question-bank-builder";
import { useQuestionBankData } from "@/hooks/use-question-bank-data";
import { toast } from "@/hooks/use-toast";
import { uploadFile } from "@/lib/uploads-api";
import { BookOpen, FileText, FolderTree, Plus, Shapes, Upload } from "lucide-react";

const SOURCES_FOLDER = "sources";

function formatFileSize(bytes: number) {
  if (bytes === 0) return "0 Bytes";
  const unit = Math.floor(Math.log(bytes) / Math.log(1024));
  const sizes = ["Bytes", "KB", "MB", "GB"];
  return `${parseFloat((bytes / 1024 ** unit).toFixed(2))} ${sizes[unit]}`;
}

export default function QuestionBankPage() {
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isSourceDialogOpen, setIsSourceDialogOpen] = useState(false);
  const [isUploadingSource, setIsUploadingSource] = useState(false);
  const [newSourceName, setNewSourceName] = useState("");
  const [selectedSourceFile, setSelectedSourceFile] = useState<File | null>(null);
  const builder = useQuestionBankBuilder();
  const data = useQuestionBankData({
    searchQuery: builder.searchQuery,
    selectedCategoryFilter: builder.selectedCategoryFilter,
    selectedDifficulty: builder.selectedDifficulty,
  });
  const totalTopicCount = data.questionBank.reduce(
    (sum, category) => sum + category.topics.length,
    0,
  );
  const totalQuestionCount = data.questionBank.reduce(
    (sum, category) =>
      sum +
      category.topics.reduce((topicSum, topic) => topicSum + topic.questions.length, 0),
    0,
  );

  const handleSourceFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setSelectedSourceFile(file);
    setNewSourceName(file.name);
  };

  const handleSourceUpload = async () => {
    if (!selectedSourceFile || !newSourceName.trim()) {
      toast({
        title: "Алдаа",
        description: "Файл сонгоод нэр оруулна уу.",
        variant: "destructive",
      });
      return;
    }

    setIsUploadingSource(true);
    try {
      const createdFile = await uploadFile({
        file: selectedSourceFile,
        fileName: newSourceName.trim(),
        folder: SOURCES_FOLDER,
      });
      data.setSourceFiles((current) => [createdFile, ...current]);
      setSelectedSourceFile(null);
      setNewSourceName("");
      setIsSourceDialogOpen(false);
      toast({
        title: "Амжилттай",
        description: "Эх сурвалж файл нэмэгдлээ.",
      });
    } catch (error) {
      toast({
        title: "Алдаа",
        description:
          error instanceof Error ? error.message : "Файл нэмэх үед алдаа гарлаа.",
        variant: "destructive",
      });
    } finally {
      setIsUploadingSource(false);
    }
  };

  return (
    <TeacherPageShell>
      <TeacherPageHeader
        title="Асуултын сан"
        description="Эх сурвалж, ангилал, сэдэв, асуултуудаа нэг урсгалаар удирдаж, аль анги болон түвшинд ашиглах сангаа цэгцтэй хадгална."
        icon={BookOpen}
        eyebrow={
          <>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#dde7ff] bg-white/80 px-3 py-1.5">
              <FolderTree className="h-4 w-4 text-[#5b91fc]" />
              {data.questionBank.length} ангилал
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#dde7ff] bg-white/80 px-3 py-1.5">
              <Shapes className="h-4 w-4 text-[#5b91fc]" />
              {totalTopicCount} сэдэв
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-[#dde7ff] bg-white/80 px-3 py-1.5">
              <BookOpen className="h-4 w-4 text-[#5b91fc]" />
              {totalQuestionCount} асуулт
            </span>
          </>
        }
        actions={
          <>
            <Button asChild>
              <Link href="/teacher/question-bank/create">
                <Plus className="mr-2 h-4 w-4" />
                Шинэ асуултууд үүсгэх
              </Link>
            </Button>
          </>
        }
      />

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.72fr)]">
        <div className="space-y-4">
          <QuestionBankFiltersCard
            onSearchQueryChange={builder.setSearchQuery}
            onSelectedCategoryFilterChange={(value) => {
              if (value === CREATE_CATEGORY_FILTER_VALUE) {
                setIsCategoryDialogOpen(true);
                return;
              }

              builder.setSelectedCategoryFilter(value);
            }}
            onSelectedDifficultyChange={builder.setSelectedDifficulty}
            questionBank={data.questionBank}
            searchQuery={builder.searchQuery}
            selectedCategoryFilter={builder.selectedCategoryFilter}
            selectedDifficulty={builder.selectedDifficulty}
          />

          <QuestionBankResults
            categories={data.filteredCategories}
            isLoading={data.isLoading}
          />
        </div>

        <TeacherSurfaceCard className="space-y-5">
          <div className="flex items-start justify-between gap-3">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8aa0d2]">
                Эх сурвалж
              </p>
              <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#303959] dark:text-white">
                AI-д ашиглах файлууд
              </h2>
              <p className="text-sm leading-6 text-[#6f7898] dark:text-[#9eabcf]">
                Энд байгаа файлууд AI асуулт үүсгэх хэсэгт шууд харагдана.
              </p>
            </div>
            <Button
              className="rounded-2xl bg-[#f3e7f7] text-[#7a3f75] shadow-none hover:bg-[#eddcf3]"
              onClick={() => setIsSourceDialogOpen(true)}
            >
              <Upload className="mr-2 h-4 w-4" />
              New source file
            </Button>
          </div>

          <div className="space-y-3">
            {data.sourceFiles.length === 0 ? (
              <div className="rounded-[24px] border border-dashed border-[#d7e3ff] bg-[linear-gradient(180deg,#f9fbff_0%,#ffffff_100%)] px-4 py-8 text-center">
                <FileText className="mx-auto mb-3 h-10 w-10 text-[#98a9ca]" />
                <p className="font-medium text-[#344264]">Эх сурвалж файл алга байна</p>
                <p className="mt-1 text-sm text-[#6f7898]">
                  Шинэ файл нэмээд AI-аар асуулт үүсгэхдээ ашиглаарай.
                </p>
              </div>
            ) : (
              data.sourceFiles.slice(0, 6).map((file) => (
                <div
                  key={file.id}
                  className="rounded-[24px] border border-[#dde7ff] bg-[linear-gradient(180deg,#f9fbff_0%,#ffffff_100%)] px-4 py-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="rounded-2xl bg-[#eef4ff] p-2 text-[#5b91fc]">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-[#344264]">
                        {file.originalName}
                      </p>
                      <p className="mt-1 text-sm text-[#6f7898]">
                        {formatFileSize(file.size)} •{" "}
                        {new Date(file.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {data.sourceFiles.length > 6 ? (
            <Button variant="outline" asChild className="w-full">
              <Link href="/teacher/sources">Бүх эх сурвалж харах</Link>
            </Button>
          ) : null}
        </TeacherSurfaceCard>
      </section>

      <Dialog
        open={isCategoryDialogOpen}
        onOpenChange={setIsCategoryDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Шинэ ангилал нэмэх</DialogTitle>
            <DialogDescription>
              Ангиллын нэр оруулаад асуултын сандаа нэмнэ.
            </DialogDescription>
          </DialogHeader>

          <Input
            placeholder="Жишээ: Математик"
            value={builder.newCategoryName}
            onChange={(event) => builder.setNewCategoryName(event.target.value)}
          />

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsCategoryDialogOpen(false)}
            >
              Болих
            </Button>
            <Button
              onClick={() =>
                void createQuestionBankCategoryAction({
                  name: builder.newCategoryName,
                  onCreated: (categoryId) => {
                    builder.setSelectedCategoryFilter(categoryId);
                    setIsCategoryDialogOpen(false);
                  },
                  setBuilderCategoryId: builder.setBuilderCategoryId,
                  setBuilderNewCategoryName: builder.setBuilderNewCategoryName,
                  setIsCreatingCategory,
                  setNewCategoryName: builder.setNewCategoryName,
                  setQuestionBank: data.setQuestionBank,
                })
              }
              disabled={isCreatingCategory}
            >
              {isCreatingCategory ? "Нэмж байна..." : "Нэмэх"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog
        open={isSourceDialogOpen}
        onOpenChange={setIsSourceDialogOpen}
      >
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
                onChange={(event) => setNewSourceName(event.target.value)}
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
                onChange={handleSourceFileSelect}
              />
            </div>

            {selectedSourceFile ? (
              <div className="rounded-xl bg-muted p-3 text-sm text-muted-foreground">
                {selectedSourceFile.name} ({formatFileSize(selectedSourceFile.size)})
              </div>
            ) : null}
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSourceDialogOpen(false)}
            >
              Болих
            </Button>
            <Button
              onClick={() => void handleSourceUpload()}
              disabled={!selectedSourceFile || !newSourceName.trim() || isUploadingSource}
            >
              {isUploadingSource ? "Нэмж байна..." : "Эх сурвалж нэмэх"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </TeacherPageShell>
  );
}
