"use client";

import Link from "next/link";
import { CREATE_CATEGORY_OPTION } from "@/components/teacher/question-bank-builder-card";
import { getQuestionTypeLabel, QuestionBankSummaryStat } from "@/components/teacher/question-bank-summary-stat";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { NewQuestion, QuestionType } from "@/components/teacher/exam-builder-types";
import type { QuestionBankCategory, QuestionBankDifficulty } from "@/lib/question-bank-api";

export function QuestionBankCreateSummary({
  builderCategoryId,
  builderDifficulty,
  builderNewCategoryName,
  builderQuestions,
  builderTopicName,
  isCreatingCategory,
  isSaving,
  onBuilderCategoryIdChange,
  onBuilderDifficultyChange,
  onBuilderNewCategoryNameChange,
  onCancel,
  onCreateCategory,
  onSave,
  questionBank,
}: {
  builderCategoryId: string;
  builderDifficulty: QuestionBankDifficulty;
  builderNewCategoryName: string;
  builderQuestions: NewQuestion[];
  builderTopicName: string;
  isCreatingCategory: boolean;
  isSaving: boolean;
  onBuilderCategoryIdChange: (value: string) => void;
  onBuilderDifficultyChange: (value: QuestionBankDifficulty) => void;
  onBuilderNewCategoryNameChange: (value: string) => void;
  onCancel: () => void;
  onCreateCategory: () => void;
  onSave: () => void;
  questionBank: QuestionBankCategory[];
}) {
  const questionCounts = builderQuestions.reduce(
    (counts, question) => ({
      ...counts,
      [question.type]: counts[question.type] + 1,
    }),
    {
      "multiple-choice": 0,
      "true-false": 0,
      "short-answer": 0,
      essay: 0,
    } satisfies Record<QuestionType, number>,
  );
  const totalPoints = builderQuestions.reduce(
    (sum, question) => sum + question.points,
    0,
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Хураангуй</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
          <QuestionBankSummaryStat
            label="Нийт асуулт"
            value={builderQuestions.length}
          />
          <QuestionBankSummaryStat label="Нийт оноо" value={totalPoints} />
          <QuestionBankSummaryStat
            label={getQuestionTypeLabel("multiple-choice")}
            value={questionCounts["multiple-choice"]}
          />
          <QuestionBankSummaryStat
            label={getQuestionTypeLabel("true-false")}
            value={questionCounts["true-false"]}
          />
          <QuestionBankSummaryStat
            label={getQuestionTypeLabel("short-answer")}
            value={questionCounts["short-answer"]}
          />
          <QuestionBankSummaryStat
            label={getQuestionTypeLabel("essay")}
            value={questionCounts.essay}
          />
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <div className="space-y-2">
            <Label>Ангилал</Label>
            <Select
              value={builderCategoryId || CREATE_CATEGORY_OPTION}
              onValueChange={(value) =>
                onBuilderCategoryIdChange(
                  value === CREATE_CATEGORY_OPTION ? "" : value,
                )
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Ангилал сонгох" />
              </SelectTrigger>
              <SelectContent>
                {questionBank.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
                <SelectItem value={CREATE_CATEGORY_OPTION}>
                  + Шинэ ангилал үүсгэх
                </SelectItem>
              </SelectContent>
            </Select>

            {!builderCategoryId ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Шинэ ангиллын нэр"
                  value={builderNewCategoryName}
                  onChange={(event) =>
                    onBuilderNewCategoryNameChange(event.target.value)
                  }
                />
                <Button
                  variant="outline"
                  onClick={onCreateCategory}
                  disabled={isCreatingCategory}
                >
                  {isCreatingCategory ? "Нэмж байна..." : "Нэмэх"}
                </Button>
              </div>
            ) : null}
          </div>

          <div className="space-y-2">
            <Label>Түвшин</Label>
            <Select
              value={builderDifficulty}
              onValueChange={(value) =>
                onBuilderDifficultyChange(
                  value as "easy" | "standard" | "hard",
                )
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
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          <Button variant="outline" asChild>
            <Link href="/teacher/question-bank" onClick={onCancel}>
              Болих
            </Link>
          </Button>
          <Button onClick={onSave} disabled={isSaving || !builderTopicName.trim()}>
            {isSaving ? "Хадгалж байна..." : "Асуултуудыг хадгалах"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
