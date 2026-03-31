"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AIQuestionGeneratorDialog } from "@/components/teacher/ai-question-generator-dialog";
import { ExamBuilderQuestionList } from "@/components/teacher/exam-builder-question-list";
import { CREATE_CATEGORY_OPTION } from "@/components/teacher/question-bank-builder-card";
import {
  createQuestionBankCategoryAction,
  saveQuestionBankQuestionSet,
} from "@/components/teacher/question-bank-actions";
import { generateQuestionBankAIQuestions } from "@/components/teacher/question-bank-ai-actions";
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
import { useQuestionBankBuilder } from "@/hooks/use-question-bank-builder";
import { useQuestionBankData } from "@/hooks/use-question-bank-data";
import type { QuestionType } from "@/components/teacher/exam-builder-types";
import { ArrowLeft, Sparkles } from "lucide-react";

function getQuestionTypeLabel(type: QuestionType) {
  if (type === "multiple-choice") return "Сонгох хариулттай";
  if (type === "true-false") return "Үнэн/Худал";
  if (type === "short-answer") return "Богино хариулт";
  return "Эсээ";
}

export default function QuestionBankCreatePage() {
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const builder = useQuestionBankBuilder();
  const data = useQuestionBankData({
    searchQuery: "",
    selectedCategoryFilter: "all",
    selectedDifficulty: "all",
  });
  const {
    addQuestion,
    builderCategoryId,
    builderDifficulty,
    builderNewCategoryName,
    builderQuestions,
    builderTopicName,
    removeQuestion,
    resetBuilder,
    selectedSourceIds,
    setBuilderCategoryId,
    setBuilderDifficulty,
    setBuilderNewCategoryName,
    setBuilderQuestions,
    setBuilderTopicName,
    setNewCategoryName,
    setSelectedSourceIds,
    setShowAIDialog,
    showAIDialog,
    updateOption,
    updateQuestion,
  } = builder;

  useEffect(() => {
    if (!builderCategoryId && data.questionBank[0]) {
      setBuilderCategoryId(data.questionBank[0].id);
    }
  }, [builderCategoryId, data.questionBank, setBuilderCategoryId]);

  const questionCounts = useMemo(
    () =>
      builderQuestions.reduce(
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
      ),
    [builderQuestions],
  );

  const totalPoints = useMemo(
    () => builderQuestions.reduce((sum, question) => sum + question.points, 0),
    [builderQuestions],
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 border-b pb-5">
        <Link
          href="/teacher/question-bank"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:underline"
        >
          <ArrowLeft className="h-4 w-4" />
          Асуултын сан руу буцах
        </Link>
      </div>

      <section className="space-y-4">
        <div>
          <h1 className="text-2xl font-bold">Шинэ асуултууд үүсгэх</h1>
          <p className="text-muted-foreground">
            Сэдвээ бичээд асуултуудаа нэг урсгалаар бэлтгэнэ.
          </p>
        </div>

        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div className="flex-1 space-y-2">
            <Label htmlFor="topic-name">Сэдвийн нэр</Label>
            <Input
              id="topic-name"
              placeholder="Жишээ: Алгебр 7 томьёо"
              value={builderTopicName}
              onChange={(event) => setBuilderTopicName(event.target.value)}
            />
          </div>
          <Button variant="outline" onClick={() => setShowAIDialog(true)}>
            <Sparkles className="mr-2 h-4 w-4" />
            Create question with AI
          </Button>
        </div>

        <ExamBuilderQuestionList
          onAddQuestion={addQuestion}
          onRemoveQuestion={removeQuestion}
          onUpdateOption={updateOption}
          onUpdateQuestion={updateQuestion}
          questions={builderQuestions}
        />
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Хураангуй</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-6">
            <SummaryStat label="Нийт асуулт" value={builderQuestions.length} />
            <SummaryStat label="Нийт оноо" value={totalPoints} />
            <SummaryStat
              label={getQuestionTypeLabel("multiple-choice")}
              value={questionCounts["multiple-choice"]}
            />
            <SummaryStat
              label={getQuestionTypeLabel("true-false")}
              value={questionCounts["true-false"]}
            />
            <SummaryStat
              label={getQuestionTypeLabel("short-answer")}
              value={questionCounts["short-answer"]}
            />
            <SummaryStat
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
                  setBuilderCategoryId(
                    value === CREATE_CATEGORY_OPTION ? "" : value,
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Ангилал сонгох" />
                </SelectTrigger>
                <SelectContent>
                  {data.questionBank.map((category) => (
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
                      setBuilderNewCategoryName(event.target.value)
                    }
                  />
                  <Button
                    variant="outline"
                    onClick={() =>
                      void createQuestionBankCategoryAction({
                        name: builderNewCategoryName,
                        onCreated: setBuilderCategoryId,
                        setBuilderCategoryId,
                        setBuilderNewCategoryName,
                        setIsCreatingCategory,
                        setNewCategoryName,
                        setQuestionBank: data.setQuestionBank,
                      })
                    }
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
                  setBuilderDifficulty(value as "easy" | "standard" | "hard")
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
              <Link href="/teacher/question-bank">Болих</Link>
            </Button>
            <Button
              onClick={() =>
                void saveQuestionBankQuestionSet({
                  builderCategoryId,
                  builderDifficulty,
                  builderQuestions,
                  builderTopicName,
                  onComplete: () => {
                    resetBuilder();
                    router.push("/teacher/question-bank");
                  },
                  setIsSaving,
                  setQuestionBank: data.setQuestionBank,
                })
              }
              disabled={isSaving}
            >
              {isSaving ? "Хадгалж байна..." : "Асуултуудыг хадгалах"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <AIQuestionGeneratorDialog
        availableSourceFiles={data.sourceFiles}
        isGenerating={isGenerating}
        onGenerate={(payload) =>
          generateQuestionBankAIQuestions({
            builderCategoryId,
            onComplete: () => setShowAIDialog(false),
            payload,
            questionBank: data.questionBank,
            setBuilderDifficulty,
            setBuilderQuestions,
            setIsGenerating,
            sourceFiles: data.sourceFiles,
          })
        }
        onOpenChange={setShowAIDialog}
        onToggleTest={(sourceId, checked) =>
          setSelectedSourceIds((current) =>
            checked
              ? [...new Set([...current, sourceId])]
              : current.filter((id) => id !== sourceId),
          )
        }
        open={showAIDialog}
        selectedMockTests={selectedSourceIds}
      />
    </div>
  );
}

function SummaryStat({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl bg-muted/50 px-4 py-4">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}
