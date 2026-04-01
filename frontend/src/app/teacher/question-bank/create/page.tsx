"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AIQuestionGeneratorCard } from "@/components/teacher/ai-question-generator-card";
import { CreateQuestionBankCategoryDialog } from "@/components/teacher/create-question-bank-category-dialog";
import { ExamBuilderQuestionList } from "@/components/teacher/exam-builder-question-list";
import { CREATE_CATEGORY_OPTION } from "@/components/teacher/question-bank-builder-card";
import { createQuestionBankCategoryAction, saveQuestionBankQuestionSet } from "@/components/teacher/question-bank-actions";
import { generateQuestionBankAIQuestions } from "@/components/teacher/question-bank-ai-actions";
import { QuestionBankCreateSummary } from "@/components/teacher/question-bank-create-summary";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuestionBankBuilder } from "@/hooks/use-question-bank-builder";
import { useQuestionBankData } from "@/hooks/use-question-bank-data";
import { ArrowLeft, Sparkles } from "lucide-react";

export default function QuestionBankCreatePage() {
  const [isCreatingCategory, setIsCreatingCategory] = useState(false), [isCreateCategoryDialogOpen, setIsCreateCategoryDialogOpen] = useState(false), [isGenerating, setIsGenerating] = useState(false), [isSaving, setIsSaving] = useState(false);
  const router = useRouter();
  const builder = useQuestionBankBuilder();
  const data = useQuestionBankData({ searchQuery: "", selectedCategoryFilter: "all", selectedDifficulty: "all" });
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
    updateOption,
    updateQuestion,
  } = builder;

  useEffect(() => { if (!builderCategoryId && data.questionBank[0]) setBuilderCategoryId(data.questionBank[0].id); }, [builderCategoryId, data.questionBank, setBuilderCategoryId]);

  const createCategory = () =>
    void createQuestionBankCategoryAction({
      name: builderNewCategoryName,
      onCreated: () => setIsCreateCategoryDialogOpen(false),
      setBuilderCategoryId,
      setBuilderNewCategoryName,
      setIsCreatingCategory,
      setNewCategoryName,
      setQuestionBank: data.setQuestionBank,
    });

  return (
    <div className="space-y-8">
      <div className="border-b pb-5">
        <Link href="/teacher/question-bank" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Асуултын сан руу буцах
        </Link>
      </div>

      <section className="grid gap-6 xl:grid-cols-[minmax(320px,0.88fr)_minmax(0,1.52fr)] 2xl:grid-cols-[minmax(340px,0.86fr)_minmax(0,1.56fr)]">
        <AIQuestionGeneratorCard
          availableSourceFiles={data.sourceFiles}
          className="xl:sticky xl:top-6 xl:self-start"
          isGenerating={isGenerating}
          onGenerate={(payload) =>
            generateQuestionBankAIQuestions({
              builderCategoryId,
              onComplete: () => undefined,
              payload,
              questionBank: data.questionBank,
              setBuilderDifficulty,
              setBuilderQuestions,
              setIsGenerating,
              sourceFiles: data.sourceFiles,
            })
          }
          onToggleTest={(sourceId, checked) =>
            setSelectedSourceIds((current) =>
              checked
                ? [...new Set([...current, sourceId])]
                : current.filter((id) => id !== sourceId),
            )
          }
          selectedMockTests={selectedSourceIds}
        />

        <div className="space-y-4">
          <Card className="border-[#d7e3ff] shadow-[0_24px_80px_rgba(77,123,255,0.1)]">
            <CardHeader className="space-y-3 border-b border-[#e4ecff]">
              <div className="flex items-start gap-3">
                <div className="mt-1 rounded-2xl bg-[#eef4ff] p-2 text-[#5b91fc]">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <CardTitle className="text-2xl text-[#23345d]">Шинэ асуулт үүсгэх</CardTitle>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Сэдвээ тодорхойлоод асуултуудаа гараар эсвэл AI-аас ирсэн
                    ноорог дээр үндэслэн шууд засварлана.
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-5 p-5 sm:p-6">
              <div className="grid gap-4 lg:grid-cols-[1.45fr_1fr]">
                <div className="space-y-2">
                  <Label htmlFor="topic-name">Сэдэв</Label>
                  <Input id="topic-name" placeholder="Жишээ: Алгебр 7 томьёо" value={builderTopicName} onChange={(event) => setBuilderTopicName(event.target.value)} className="h-12 text-base" />
                </div>
                <div className="space-y-2">
                  <Label>Ангилал</Label>
                  <Select
                    value={builderCategoryId}
                    onValueChange={(value) => value === CREATE_CATEGORY_OPTION ? setIsCreateCategoryDialogOpen(true) : setBuilderCategoryId(value)}
                  >
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Ангилал сонгоно уу" />
                    </SelectTrigger>
                    <SelectContent>
                      {data.questionBank.map((category) => (
                        <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                      ))}
                      <SelectItem value={CREATE_CATEGORY_OPTION}>+ Шинэ ангилал үүсгэх</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <ExamBuilderQuestionList
                onAddQuestion={addQuestion}
                onRemoveQuestion={removeQuestion}
                onUpdateOption={updateOption}
                onUpdateQuestion={updateQuestion}
                questions={builderQuestions}
              />
            </CardContent>
          </Card>

          <QuestionBankCreateSummary
            builderDifficulty={builderDifficulty}
            builderQuestions={builderQuestions}
            builderTopicName={builderTopicName}
            isSaving={isSaving}
            onBuilderDifficultyChange={setBuilderDifficulty}
            onCancel={resetBuilder}
            onSave={() =>
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
          />
        </div>
      </section>

      <CreateQuestionBankCategoryDialog
        isCreating={isCreatingCategory}
        open={isCreateCategoryDialogOpen}
        value={builderNewCategoryName}
        onCreate={createCategory}
        onOpenChange={setIsCreateCategoryDialogOpen}
        onValueChange={setBuilderNewCategoryName}
      />
    </div>
  );
}
