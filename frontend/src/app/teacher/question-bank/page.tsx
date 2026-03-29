"use client";

import { useEffect, useMemo, useState } from "react";
import { AIQuestionGeneratorDialog } from "@/components/teacher/ai-question-generator-dialog";
import { ExamBuilderQuestionList } from "@/components/teacher/exam-builder-question-list";
import type {
  NewQuestion,
  QuestionType,
} from "@/components/teacher/exam-builder-types";
import { Badge } from "@/components/ui/badge";
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
import { toast } from "@/hooks/use-toast";
import { requestBackendJson } from "@/lib/backend-fetch";
import {
  createQuestionBankCategory,
  createQuestionSet,
  getQuestionBank,
  type QuestionBankCategory,
  type QuestionBankDifficulty,
} from "@/lib/question-bank-api";
import { listUploads, type UploadRecord } from "@/lib/uploads-api";
import { FileQuestion, Loader2, Plus, Search, Sparkles } from "lucide-react";

const CREATE_CATEGORY_OPTION = "__create_new_category__";

type GeneratedQuestion = {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer?: string;
  points: number;
  order: number;
};

function createQuestion(type: QuestionType, id: string): NewQuestion {
  return {
    id,
    type,
    question: "",
    points:
      type === "essay"
        ? 15
        : type === "short-answer"
          ? 10
          : type === "true-false"
            ? 5
            : 10,
    options: type === "multiple-choice" ? ["", "", "", ""] : undefined,
    correctAnswer: type === "true-false" ? "True" : "",
  };
}

function toBuilderQuestion(question: GeneratedQuestion): NewQuestion {
  return {
    id: question.id,
    type: question.type,
    question: question.question,
    options: question.options,
    correctAnswer: question.correctAnswer,
    points: question.points,
  };
}

export default function QuestionBankPage() {
  const [questionBank, setQuestionBank] = useState<QuestionBankCategory[]>([]);
  const [sourceFiles, setSourceFiles] = useState<UploadRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showBuilder, setShowBuilder] = useState(false);
  const [showAIDialog, setShowAIDialog] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState("all");
  const [selectedDifficulty, setSelectedDifficulty] = useState("all");
  const [selectedSourceIds, setSelectedSourceIds] = useState<string[]>([]);
  const [builderCategoryId, setBuilderCategoryId] = useState("");
  const [builderTopicName, setBuilderTopicName] = useState("");
  const [builderDifficulty, setBuilderDifficulty] =
    useState<QuestionBankDifficulty>("standard");
  const [builderQuestions, setBuilderQuestions] = useState<NewQuestion[]>([]);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [builderNewCategoryName, setBuilderNewCategoryName] = useState("");

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        const [questionBankData, sourceFileData] = await Promise.all([
          getQuestionBank(),
          listUploads("sources"),
        ]);

        if (!isMounted) return;
        setQuestionBank(questionBankData);
        setSourceFiles(sourceFileData);
      } catch (error) {
        if (!isMounted) return;
        toast({
          title: "Алдаа",
          description:
            error instanceof Error
              ? error.message
              : "Асуултын сангийн мэдээллийг ачаалж чадсангүй.",
          variant: "destructive",
        });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!builderCategoryId && questionBank[0]) {
      setBuilderCategoryId(questionBank[0].id);
    }
  }, [builderCategoryId, questionBank]);

  const addQuestion = (type: QuestionType) => {
    setBuilderQuestions((current) => [
      ...current,
      createQuestion(type, `new-${Date.now()}-${current.length}`),
    ]);
  };

  const updateQuestion = (id: string, updates: Partial<NewQuestion>) => {
    setBuilderQuestions((current) =>
      current.map((question) =>
        question.id === id ? { ...question, ...updates } : question,
      ),
    );
  };

  const updateOption = (
    questionId: string,
    optionIndex: number,
    value: string,
  ) => {
    setBuilderQuestions((current) =>
      current.map((question) => {
        if (question.id !== questionId || !question.options) return question;
        const options = [...question.options];
        options[optionIndex] = value;
        return { ...question, options };
      }),
    );
  };

  const removeQuestion = (id: string) => {
    setBuilderQuestions((current) =>
      current.filter((question) => question.id !== id),
    );
  };

  const resetBuilder = () => {
    setBuilderTopicName("");
    setBuilderDifficulty("standard");
    setBuilderQuestions([]);
    setSelectedSourceIds([]);
  };

  const handleCreateCategory = async (
    name: string,
    onCreated?: (categoryId: string) => void,
  ) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      toast({
        title: "Алдаа",
        description: "Ангиллын нэр оруулна уу.",
        variant: "destructive",
      });
      return;
    }

    setIsCreatingCategory(true);

    try {
      const createdCategory = await createQuestionBankCategory(trimmedName);
      setQuestionBank((current) => {
        const exists = current.some((category) => category.id === createdCategory.id);
        return exists
          ? current
          : [...current, createdCategory].sort((left, right) =>
              left.name.localeCompare(right.name),
            );
      });
      setBuilderCategoryId(createdCategory.id);
      onCreated?.(createdCategory.id);
      setNewCategoryName("");
      setBuilderNewCategoryName("");

      toast({
        title: "Амжилттай",
        description: `"${createdCategory.name}" ангилал үүслээ.`,
      });
    } catch (error) {
      toast({
        title: "Алдаа",
        description:
          error instanceof Error ? error.message : "Ангилал үүсгэж чадсангүй.",
        variant: "destructive",
      });
    } finally {
      setIsCreatingCategory(false);
    }
  };

  const handleCategorySelect = (value: string) => {
    if (value === CREATE_CATEGORY_OPTION) {
      setBuilderCategoryId("");
      return;
    }

    setBuilderCategoryId(value);
  };

  const handleGenerateAIQuestions = async ({
    sourceFilesWithPages,
    aiMCCount,
    aiTFCount,
    aiShortCount,
    variants,
    difficulty,
    category,
    selectedMockTests,
  }: {
    sourceFilesWithPages: { file: File; startPage: number; endPage: number }[];
    aiMCCount: number;
    aiTFCount: number;
    aiShortCount: number;
    variants: number;
    difficulty: "easy" | "standard" | "hard";
    category: string;
    selectedMockTests: string[];
  }) => {
    const totalQuestions = aiMCCount + aiTFCount + aiShortCount;
    if (totalQuestions === 0) {
      toast({
        title: "Алдаа",
        description: "Асуултын тоо оруулна уу.",
        variant: "destructive",
      });
      return;
    }

    const selectedUploads = selectedMockTests
      .map((id) => sourceFiles.find((file) => file.id === id))
      .filter((file): file is UploadRecord => Boolean(file));

    if (selectedUploads.length === 0 && sourceFilesWithPages.length === 0) {
      toast({
        title: "Алдаа",
        description: "Эх сурвалж файл сонгоно уу.",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    try {
      const generatedQuestions = await requestBackendJson<GeneratedQuestion[]>(
        "exams/ai/generate",
        {
          method: "POST",
          body: {
          sourceFiles: [
            ...selectedUploads.map((file) => ({
              name: file.originalName,
              startPage: 1,
              endPage: 10,
            })),
            ...sourceFilesWithPages.map((item) => ({
              name: item.file.name,
              startPage: item.startPage,
              endPage: item.endPage,
            })),
          ],
          mcCount: aiMCCount,
          tfCount: aiTFCount,
          shortAnswerCount: aiShortCount,
          variants,
          difficulty,
          category:
            category ||
            questionBank.find((item) => item.id === builderCategoryId)?.name ||
            "Ерөнхий",
        },
          fallbackMessage: "AI асуулт үүсгэхэд алдаа гарлаа.",
        },
      );

      setBuilderQuestions((current) => [
        ...current,
        ...generatedQuestions.map(toBuilderQuestion),
      ]);
      setBuilderDifficulty(difficulty);
      setShowAIDialog(false);

      toast({
        title: "Амжилттай",
        description: `${generatedQuestions.length} асуулт ноорогт нэмэгдлээ.`,
      });
    } catch (error) {
      toast({
        title: "Алдаа",
        description:
          error instanceof Error
            ? error.message
            : "AI асуулт үүсгэхэд алдаа гарлаа.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveQuestionSet = async () => {
    if (!builderCategoryId) {
      toast({
        title: "Алдаа",
        description: "Ангилал сонгоно уу.",
        variant: "destructive",
      });
      return;
    }

    if (!builderTopicName.trim()) {
      toast({
        title: "Алдаа",
        description: "Сэдвийн нэр оруулна уу.",
        variant: "destructive",
      });
      return;
    }

    const hasEmptyQuestion = builderQuestions.some(
      (question) => !question.question.trim(),
    );
    if (builderQuestions.length === 0 || hasEmptyQuestion) {
      toast({
        title: "Алдаа",
        description: "Хамгийн багадаа нэг бүрэн асуулт оруулна уу.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      await createQuestionSet({
        categoryId: builderCategoryId,
        topicName: builderTopicName,
        difficulty: builderDifficulty,
        questions: builderQuestions,
      });

      const updatedQuestionBank = await getQuestionBank();
      setQuestionBank(updatedQuestionBank);
      resetBuilder();
      setShowBuilder(false);

      toast({
        title: "Амжилттай",
        description: "Шинэ асуултууд асуултын санд хадгалагдлаа.",
      });
    } catch (error) {
      toast({
        title: "Алдаа",
        description:
          error instanceof Error
            ? error.message
            : "Асуултуудыг хадгалж чадсангүй.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const filteredCategories = useMemo(() => {
    return questionBank
      .filter((category) =>
        selectedCategoryFilter === "all"
          ? true
          : category.id === selectedCategoryFilter,
      )
      .map((category) => {
        const topics = category.topics
          .map((topic) => {
            const questions = topic.questions.filter((question) => {
              const matchesSearch = question.question
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
              const matchesDifficulty =
                selectedDifficulty === "all" ||
                question.difficulty === selectedDifficulty;
              return matchesSearch && matchesDifficulty;
            });

            return {
              ...topic,
              questions,
            };
          })
          .filter((topic) => {
            if (!searchQuery.trim()) {
              return topic.questions.length > 0;
            }

            return (
              topic.questions.length > 0 ||
              topic.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
          });

        return {
          ...category,
          topics,
        };
      })
      .filter((category) => {
        if (!searchQuery.trim()) {
          return category.topics.length > 0;
        }

        return (
          category.topics.length > 0 ||
          category.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
      });
  }, [questionBank, searchQuery, selectedCategoryFilter, selectedDifficulty]);

  const builderCategoryName =
    questionBank.find((category) => category.id === builderCategoryId)?.name ?? "";

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Асуултын сан</h1>
          <p className="text-muted-foreground">
            Ангилал, сэдвээр зохион байгуулсан асуултууд.
          </p>
        </div>
        <Button onClick={() => setShowBuilder((current) => !current)}>
          <Plus className="mr-2 h-4 w-4" />
          Шинэ асуултууд үүсгэх
        </Button>
      </div>

      {showBuilder ? (
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle>Шинэ асуултууд үүсгэх</CardTitle>
            <p className="text-sm text-muted-foreground">
              Ангилал, сэдвээ сонгоод асуултаа гараар эсвэл AI-аар нэмнэ.
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Ангилал</Label>
                <Select
                  value={builderCategoryId || CREATE_CATEGORY_OPTION}
                  onValueChange={handleCategorySelect}
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
                      onChange={(e) => setBuilderNewCategoryName(e.target.value)}
                    />
                    <Button
                      variant="secondary"
                      onClick={() =>
                        void handleCreateCategory(builderNewCategoryName, (id) =>
                          setBuilderCategoryId(id),
                        )
                      }
                      disabled={isCreatingCategory}
                    >
                      Нэмэх
                    </Button>
                  </div>
                ) : null}
              </div>

              <div className="space-y-2">
                <Label>Сэдэв</Label>
                <Input
                  placeholder="Жишээ: Алгебр 7 томьёо"
                  value={builderTopicName}
                  onChange={(e) => setBuilderTopicName(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label>Түвшин</Label>
                <Select
                  value={builderDifficulty}
                  onValueChange={(value: QuestionBankDifficulty) =>
                    setBuilderDifficulty(value)
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

            <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-muted/30 p-4">
              <div>
                <p className="font-medium">
                  {builderCategoryName || "Ангиллаа сонгоно уу"}
                </p>
                <p className="text-sm text-muted-foreground">
                  Сэдэв доторх асуултуудыг энд бэлтгээд дараа нь нэг дор
                  хадгална.
                </p>
              </div>
              <Button variant="secondary" onClick={() => setShowAIDialog(true)}>
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

            <div className="flex flex-wrap justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  resetBuilder();
                  setShowBuilder(false);
                }}
              >
                Болих
              </Button>
              <Button onClick={() => void handleSaveQuestionSet()} disabled={isSaving}>
                {isSaving ? "Хадгалж байна..." : "Асуултуудыг хадгалах"}
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : null}

      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex flex-col gap-4 md:flex-row">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  className="pl-10"
                  placeholder="Асуулт хайх..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                />
              </div>
            </div>

            <Select
              value={selectedCategoryFilter}
              onValueChange={setSelectedCategoryFilter}
            >
              <SelectTrigger className="w-full md:w-56">
                <SelectValue placeholder="Ангилал сонгох" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Бүх ангилал</SelectItem>
                {questionBank.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Түвшин сонгох" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Бүх түвшин</SelectItem>
                <SelectItem value="easy">Хөнгөн</SelectItem>
                <SelectItem value="standard">Дунд</SelectItem>
                <SelectItem value="hard">Хэцүү</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-3 border-t pt-4 md:flex-row md:items-end">
            <div className="flex-1 space-y-2">
              <Label>Шинэ ангилал</Label>
              <Input
                placeholder="Жишээ: Математик"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
            <Button
              variant="secondary"
              onClick={() => void handleCreateCategory(newCategoryName)}
              disabled={isCreatingCategory}
            >
              Create new category
            </Button>
          </div>
        </CardContent>
      </Card>

      {isLoading ? (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Асуултын санг ачаалж байна...
        </div>
      ) : filteredCategories.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <FileQuestion className="mx-auto mb-4 h-12 w-12 opacity-50" />
            <p>Асуулт олдсонгүй</p>
            <p className="text-sm">
              Шүүлтүүрээ өөрчилж үзэх эсвэл шинэ асуултууд үүсгэнэ үү.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredCategories.map((category) => (
            <Card key={category.id}>
              <CardHeader className="space-y-3">
                <div>
                  <CardTitle>{category.name}</CardTitle>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {category.topics.map((topic) => (
                      <Badge key={topic.id} variant="secondary">
                        {topic.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {category.topics.map((topic) => (
                  <div key={topic.id} className="rounded-lg border p-4">
                    <div className="mb-3 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold">{topic.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {topic.questions.length} асуулт
                        </p>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {topic.questions.map((question) => (
                        <div
                          key={question.id}
                          className="rounded-md border bg-background p-3"
                        >
                          <p className="font-medium">{question.question}</p>
                          <div className="mt-2 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <Badge variant="outline">{question.type}</Badge>
                            <Badge variant="secondary">
                              {question.difficulty === "easy"
                                ? "Хөнгөн"
                                : question.difficulty === "standard"
                                  ? "Дунд"
                                  : "Хэцүү"}
                            </Badge>
                            <span>{question.points} оноо</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <AIQuestionGeneratorDialog
        availableSourceFiles={sourceFiles}
        isGenerating={isGenerating}
        onGenerate={handleGenerateAIQuestions}
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
