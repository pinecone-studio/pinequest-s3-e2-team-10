"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AIQuestionGeneratorCard } from "@/components/teacher/ai-question-generator-card";
import { CreateQuestionBankCategoryDialog } from "@/components/teacher/create-question-bank-category-dialog";
import { QuestionBankCreateBuilderCard } from "@/components/teacher/question-bank-create-builder-card";
import { createQuestionBankCategoryAction, saveQuestionBankQuestionSet } from "@/components/teacher/question-bank-actions";
import { generateQuestionBankAIQuestions } from "@/components/teacher/question-bank-ai-actions";
import { QuestionBankCreateSummary } from "@/components/teacher/question-bank-create-summary";
import { useQuestionBankBuilder } from "@/hooks/use-question-bank-builder";
import { useQuestionBankData } from "@/hooks/use-question-bank-data";
import { ArrowLeft } from "lucide-react";

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
          <QuestionBankCreateBuilderCard
            builderCategoryId={builderCategoryId}
            builderQuestions={builderQuestions}
            builderTopicName={builderTopicName}
            onAddQuestion={addQuestion}
            onCategoryChange={setBuilderCategoryId}
            onCreateCategory={() => setIsCreateCategoryDialogOpen(true)}
            onRemoveQuestion={removeQuestion}
            onTopicNameChange={setBuilderTopicName}
            onUpdateOption={updateOption}
            onUpdateQuestion={updateQuestion}
            questionBank={data.questionBank}
          />

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
