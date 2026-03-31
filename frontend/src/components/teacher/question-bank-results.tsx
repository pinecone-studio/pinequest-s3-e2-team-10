"use client";

import { useMemo, useState } from "react";
import { Badge } from "@/components/ui/badge";
import type { QuestionBankCategory } from "@/lib/question-bank-api";
import { ChevronDown, FileQuestion, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

type QuestionBankResultsProps = {
  categories: QuestionBankCategory[];
  isLoading: boolean;
};

function getDifficultyLabel(difficulty: string) {
  if (difficulty === "easy") return "Хөнгөн";
  if (difficulty === "standard") return "Дунд";
  return "Хэцүү";
}

export function QuestionBankResults({
  categories,
  isLoading,
}: QuestionBankResultsProps) {
  const [expandedTopicIds, setExpandedTopicIds] = useState<string[]>([]);

  const topicIds = useMemo(
    () => categories.flatMap((category) => category.topics.map((topic) => topic.id)),
    [categories],
  );

  const visibleExpandedTopicIds = expandedTopicIds.filter((topicId) =>
    topicIds.includes(topicId),
  );

  const toggleTopic = (topicId: string) => {
    setExpandedTopicIds((current) =>
      current.includes(topicId)
        ? current.filter((id) => id !== topicId)
        : [...current, topicId],
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" />
        Асуултын санг ачаалж байна...
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed bg-background/70 px-6 py-12 text-center text-muted-foreground">
        <FileQuestion className="mx-auto mb-4 h-12 w-12 opacity-50" />
        <p>Асуулт олдсонгүй</p>
        <p className="text-sm">
          Шүүлтүүрээ өөрчилж үзэх эсвэл шинэ асуултууд үүсгэнэ үү.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <section key={category.id} className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-3">
            <div>
              <h2 className="text-lg font-semibold">{category.name}</h2>
              <p className="text-sm text-muted-foreground">
                {category.topics.length} сэдэв
              </p>
            </div>
            <Badge variant="outline">
              {category.topics.reduce((sum, topic) => sum + topic.questions.length, 0)} асуулт
            </Badge>
          </div>

          <div className="space-y-3">
            {category.topics.map((topic) => {
              const isExpanded = visibleExpandedTopicIds.includes(topic.id);

              return (
                <div key={topic.id} className="space-y-3">
                  <button
                    type="button"
                    onClick={() => toggleTopic(topic.id)}
                    className="flex w-full items-center justify-between rounded-2xl border bg-background/70 px-5 py-4 text-left transition-colors hover:border-foreground/30 hover:bg-background"
                  >
                    <div>
                      <h3 className="font-semibold">{topic.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {topic.questions.length} асуулт
                      </p>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 text-muted-foreground transition-transform",
                        isExpanded ? "rotate-180" : "",
                      )}
                    />
                  </button>

                  {isExpanded ? (
                    <div className="space-y-3 border-l border-border/70 pl-4">
                      {topic.questions.map((question, index) => (
                        <div
                          key={question.id}
                          className="rounded-2xl border bg-background/60 px-4 py-3"
                        >
                          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                            <span>Асуулт {index + 1}</span>
                            <Badge variant="outline">{question.type}</Badge>
                            <Badge variant="secondary">
                              {getDifficultyLabel(question.difficulty)}
                            </Badge>
                            <span>{question.points} оноо</span>
                          </div>
                          <p className="mt-3 font-medium">{question.question}</p>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
