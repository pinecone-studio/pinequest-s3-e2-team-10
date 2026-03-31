"use client";

import Link from "next/link";
import { useState } from "react";
import { createQuestionBankCategoryAction } from "@/components/teacher/question-bank-actions";
import {
  CREATE_CATEGORY_FILTER_VALUE,
  QuestionBankFiltersCard,
} from "@/components/teacher/question-bank-filters-card";
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
import { Plus } from "lucide-react";

export default function QuestionBankPage() {
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const builder = useQuestionBankBuilder();
  const data = useQuestionBankData({
    searchQuery: builder.searchQuery,
    selectedCategoryFilter: builder.selectedCategoryFilter,
    selectedDifficulty: builder.selectedDifficulty,
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Асуултын сан</h1>
          <p className="text-muted-foreground">
            Эх сурвалж файлууд болон асуултуудаа нэг газраас удирдана.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/teacher/sources">Мэдлэгийн сан</Link>
          </Button>
          <Button asChild>
            <Link href="/teacher/question-bank/create">
              <Plus className="mr-2 h-4 w-4" />
              Шинэ асуултууд үүсгэх
            </Link>
          </Button>
        </div>
      </div>

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

      <section className="space-y-4">
        <QuestionBankResults
          categories={data.filteredCategories}
          isLoading={data.isLoading}
        />
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
    </div>
  );
}
