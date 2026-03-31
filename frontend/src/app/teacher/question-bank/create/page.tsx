"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AIQuestionGeneratorDialog } from "@/components/teacher/ai-question-generator-dialog";
import { ExamBuilderQuestionList } from "@/components/teacher/exam-builder-question-list";
import {
  createQuestionBankCategoryAction,
  saveQuestionBankQuestionSet,
} from "@/components/teacher/question-bank-actions";
import { generateQuestionBankAIQuestions } from "@/components/teacher/question-bank-ai-actions";
import { QuestionBankCreateSummary } from "@/components/teacher/question-bank-create-summary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useQuestionBankBuilder } from "@/hooks/use-question-bank-builder";
import { useQuestionBankData } from "@/hooks/use-question-bank-data";
import { ArrowLeft, Sparkles } from "lucide-react";

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

      <QuestionBankCreateSummary
        builderCategoryId={builderCategoryId}
        builderDifficulty={builderDifficulty}
        builderNewCategoryName={builderNewCategoryName}
        builderQuestions={builderQuestions}
        builderTopicName={builderTopicName}
        isCreatingCategory={isCreatingCategory}
        isSaving={isSaving}
        onBuilderCategoryIdChange={setBuilderCategoryId}
        onBuilderDifficultyChange={setBuilderDifficulty}
        onBuilderNewCategoryNameChange={setBuilderNewCategoryName}
        onCancel={resetBuilder}
        onCreateCategory={() =>
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
        questionBank={data.questionBank}
      />

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
