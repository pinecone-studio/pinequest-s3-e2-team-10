"use client";

import * as React from "react";
import { CreateExamPageHeader } from "@/components/teacher/create-exam-page-header";
import { CreateExamSubmitActions } from "@/components/teacher/create-exam-submit-actions";
import { ExamBuilderQuestionList } from "@/components/teacher/exam-builder-question-list";
import { ExamBuilderSummaryCard } from "@/components/teacher/exam-builder-summary-card";
import { filterQuestionBank } from "@/components/teacher/question-bank-filter";
import { QuestionBankFiltersCard } from "@/components/teacher/question-bank-filters-card";
import { QuestionBankResults } from "@/components/teacher/question-bank-results";
import {
  TeacherPageShell,
  TeacherSurfaceCard,
} from "@/components/teacher/teacher-page-primitives";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useExamBuilder } from "@/hooks/use-exam-builder";
import { useExamCreation } from "@/hooks/use-exam-creation";
import { useQuestionBankData } from "@/hooks/use-question-bank-data";
import {
  clearSelectedExamQuestions,
  loadSelectedExamQuestions,
  saveSelectedExamQuestions,
  toExamBuilderQuestion,
} from "@/lib/exam-question-selection";
import type { QuestionBankQuestion } from "@/lib/question-bank-api";
import { ArrowDown, ArrowUp, Trash2 } from "lucide-react";

type SelectedQuestionEntry = {
  categoryName: string;
  question: QuestionBankQuestion;
  topicName: string;
};

export default function CreateExamPage() {
  const builder = useExamBuilder();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] =
    React.useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = React.useState("all");
  const [selectedQuestionIds, setSelectedQuestionIds] = React.useState<
    string[]
  >([]);

  const {
    addQuestion,
    addScheduleEntry,
    duration,
    examTitle,
    questions,
    removeQuestion,
    removeScheduleEntry,
    reportReleaseMode,
    scheduleEntries,
    setDuration,
    setExamTitle,
    setQuestions,
    setReportReleaseMode,
    updateOption,
    updateQuestion,
    updateScheduleEntry,
  } = builder;

  const questionBankData = useQuestionBankData({
    searchQuery,
    selectedCategoryFilter,
    selectedDifficulty,
  });

  React.useEffect(() => {
    const selectedQuestions = loadSelectedExamQuestions();
    setSelectedQuestionIds(
      selectedQuestions
        .map((question) =>
          question.id.startsWith("bank-")
            ? question.id.replace("bank-", "")
            : null,
        )
        .filter((questionId): questionId is string => Boolean(questionId)),
    );
  }, []);

  const filteredQuestionBank = React.useMemo(
    () =>
      filterQuestionBank(
        questionBankData.questionBank,
        searchQuery,
        selectedCategoryFilter,
        selectedDifficulty,
      ),
    [
      questionBankData.questionBank,
      searchQuery,
      selectedCategoryFilter,
      selectedDifficulty,
    ],
  );

  const questionLookup = React.useMemo(
    () =>
      new Map(
        questionBankData.questionBank.flatMap((category) =>
          category.topics.flatMap((topic) =>
            topic.questions.map((question) => [
              question.id,
              {
                categoryName: category.name,
                question,
                topicName: topic.name,
              } satisfies SelectedQuestionEntry,
            ]),
          ),
        ),
      ),
    [questionBankData.questionBank],
  );

  const selectedQuestions = React.useMemo(
    () =>
      selectedQuestionIds
        .map((questionId) => questionLookup.get(questionId))
        .filter((entry): entry is SelectedQuestionEntry => entry !== undefined),
    [questionLookup, selectedQuestionIds],
  );

  const supportedSelectedQuestions = React.useMemo(
    () =>
      selectedQuestions
        .map(({ question }) => toExamBuilderQuestion(question))
        .filter((question): question is NonNullable<typeof question> =>
          Boolean(question),
        ),
    [selectedQuestions],
  );

  React.useEffect(() => {
    setQuestions((current) => {
      const currentById = new Map(current.map((question) => [question.id, question]));
      const nextQuestions = supportedSelectedQuestions.map(
        (question) => currentById.get(question.id) ?? question,
      );

      const isSame =
        current.length === nextQuestions.length &&
        current.every((question, index) => question.id === nextQuestions[index]?.id);

      if (isSame) {
        return current;
      }

      saveSelectedExamQuestions(nextQuestions);
      return nextQuestions;
    });
  }, [setQuestions, supportedSelectedQuestions]);

  const handleToggleQuestion = React.useCallback(
    (questionId: string, checked: boolean) => {
      setSelectedQuestionIds((current) =>
        checked
          ? [...new Set([...current, questionId])]
          : current.filter((id) => id !== questionId),
      );
    },
    [],
  );

  const moveSelectedQuestion = React.useCallback(
    (questionId: string, direction: "up" | "down") => {
      setSelectedQuestionIds((current) => {
        const currentIndex = current.indexOf(questionId);
        if (currentIndex === -1) {
          return current;
        }

        const targetIndex =
          direction === "up" ? currentIndex - 1 : currentIndex + 1;

        if (targetIndex < 0 || targetIndex >= current.length) {
          return current;
        }

        const next = [...current];
        [next[currentIndex], next[targetIndex]] = [
          next[targetIndex],
          next[currentIndex],
        ];
        return next;
      });
    },
    [],
  );

  const removeSelectedQuestion = React.useCallback((questionId: string) => {
    setSelectedQuestionIds((current) =>
      current.filter((entry) => entry !== questionId),
    );
  }, []);

  const creation = useExamCreation({
    duration,
    examTitle,
    mode: "create",
    onSuccess: clearSelectedExamQuestions,
    questions,
    reportReleaseMode,
    scheduleEntries,
  });

  const questionCounts = {
    "multiple-choice": questions.filter((q) => q.type === "multiple-choice")
      .length,
    "true-false": questions.filter((q) => q.type === "true-false").length,
    matching: questions.filter((q) => q.type === "matching").length,
    ordering: questions.filter((q) => q.type === "ordering").length,
    "short-answer": questions.filter((q) => q.type === "short-answer").length,
  };
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <TeacherPageShell>
      <CreateExamPageHeader />

      <TeacherSurfaceCard className="space-y-4">
        <div className="space-y-1">
          <h2 className="text-xl font-semibold text-[#303959]">
            Асуултын сангаас сонгох
          </h2>
          <p className="text-sm text-[#6f7898]">
            Сонгосон асуултууд доорх шалгалтын хэсэгт шууд орно.
          </p>
        </div>

        <div className="grid gap-4 lg:grid-cols-[minmax(0,1.2fr)_320px]">
          <div className="space-y-4">
            <QuestionBankFiltersCard
              onSearchQueryChange={setSearchQuery}
              onSelectedCategoryFilterChange={setSelectedCategoryFilter}
              onSelectedDifficultyChange={setSelectedDifficulty}
              questionBank={questionBankData.questionBank}
              searchQuery={searchQuery}
              selectedCategoryFilter={selectedCategoryFilter}
              selectedDifficulty={selectedDifficulty}
            />

            <ScrollArea className="h-[520px] pr-2">
              <QuestionBankResults
                categories={filteredQuestionBank}
                isLoading={questionBankData.isLoading}
                selectedQuestionIds={selectedQuestionIds}
                onToggleQuestion={handleToggleQuestion}
                isQuestionSelectable={(questionType) =>
                  questionType !== "essay"
                }
              />
            </ScrollArea>
          </div>

          <div className="rounded-[24px] border border-[#e3ebfd] bg-[#fbfcff]">
            <div className="border-b px-5 py-4">
              <h3 className="text-lg font-semibold text-[#303959]">
                Сонгосон асуултууд
              </h3>
              <p className="mt-1 text-sm text-[#6f7898]">
                Эндээс дарааллаа өөрчилнө. Чагталсан асуултууд доорх жагсаалтад
                шууд орно.
              </p>
            </div>

            <ScrollArea className="h-[520px] px-5 py-4">
              {selectedQuestions.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-[#d7e3ff] bg-white px-5 py-8 text-center text-sm text-[#6f7898]">
                  Асуулт сонгоогүй байна. Зүүн талын сэдвийг нээгээд асуултуудаа
                  чагтална уу.
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedQuestions.map(
                    ({ categoryName, question, topicName }, index) => (
                      <div
                        key={question.id}
                        className="rounded-2xl border border-[#e3ebfd] bg-white p-4 shadow-[0_8px_24px_rgba(177,198,232,0.08)]"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="text-sm font-semibold text-[#303959]">
                              {index + 1}. {question.question}
                            </div>
                            <div className="mt-2 text-xs text-[#6f7898]">
                              {categoryName} · {topicName} · {question.points}{" "}
                              оноо
                            </div>
                          </div>

                          <div className="flex shrink-0 items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                moveSelectedQuestion(question.id, "up")
                              }
                              disabled={index === 0}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                moveSelectedQuestion(question.id, "down")
                              }
                              disabled={index === selectedQuestions.length - 1}
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() =>
                                removeSelectedQuestion(question.id)
                              }
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                </div>
              )}
            </ScrollArea>
          </div>
        </div>
      </TeacherSurfaceCard>

      <TeacherSurfaceCard className="space-y-5">
        <Input
          placeholder="Шалгалтын нэр"
          value={examTitle}
          onChange={(event) => setExamTitle(event.target.value)}
          className="text-xl font-semibold border-0 border-b rounded-none focus-visible:ring-0 px-0"
        />

        <ExamBuilderQuestionList
          allowAddQuestion={false}
          onAddQuestion={addQuestion}
          onRemoveQuestion={removeQuestion}
          onUpdateOption={updateOption}
          onUpdateQuestion={updateQuestion}
          questions={questions}
        />

        <ExamBuilderSummaryCard
          duration={duration}
          onAddScheduleEntry={addScheduleEntry}
          onDurationChange={setDuration}
          onRemoveScheduleEntry={removeScheduleEntry}
          onReportReleaseModeChange={setReportReleaseMode}
          onScheduleEntryChange={updateScheduleEntry}
          questionCounts={questionCounts}
          questionTotal={questions.length}
          reportReleaseMode={reportReleaseMode}
          scheduleEntries={scheduleEntries}
          totalPoints={totalPoints}
        />

        <CreateExamSubmitActions
          canMarkReady={creation.canMarkReady}
          canSaveDraft={creation.canSaveDraft}
          canScheduleExam={creation.canScheduleExam}
          submitMode={creation.submitMode}
          onSubmitDraft={() => void creation.submitExam("draft")}
          onSubmitReady={() => void creation.submitExam("ready")}
          onSubmitScheduled={() => void creation.submitExam("scheduled")}
        />
      </TeacherSurfaceCard>
    </TeacherPageShell>
  );
}
