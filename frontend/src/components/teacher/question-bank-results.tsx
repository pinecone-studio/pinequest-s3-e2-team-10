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
      <div className="rounded-[28px] border border-white/70 bg-white/86 px-6 py-12 shadow-[0_20px_60px_rgba(177,198,232,0.14)]">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Асуултын санг ачаалж байна...
        </div>
      </div>
    );
  }

  if (categories.length === 0) {
    return (
      <div className="rounded-[28px] border border-dashed border-[#d7e3ff] bg-white/88 px-6 py-12 text-center text-muted-foreground shadow-[0_20px_60px_rgba(177,198,232,0.12)]">
        <FileQuestion className="mx-auto mb-4 h-12 w-12 opacity-50" />
        <p>Асуулт олдсонгүй</p>
        <p className="text-sm">
          Шүүлтүүрээ өөрчилж үзэх эсвэл шинэ асуултууд үүсгэнэ үү.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {categories.map((category) => (
        <section
          key={category.id}
          className="overflow-hidden rounded-[30px] border border-white/75 bg-[linear-gradient(180deg,rgba(255,255,255,0.94)_0%,rgba(247,250,255,0.92)_100%)] shadow-[0_20px_60px_rgba(177,198,232,0.14)]"
        >
          <div className="border-b border-[#e8eefb] px-5 py-5 sm:px-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-semibold tracking-[-0.02em] text-[#303959]">
                  {category.name}
                </h2>
                <p className="mt-1 text-sm text-[#6f7898]">
                  {category.topics.length} сэдэв
                </p>
              </div>
              <Badge
                variant="outline"
                className="rounded-full border-[#dce7ff] bg-[#f8fbff] px-3 py-1 text-[#4b5d86]"
              >
                {category.topics.reduce((sum, topic) => sum + topic.questions.length, 0)} асуулт
              </Badge>
            </div>
          </div>

          <div className="space-y-3 px-5 py-5 sm:px-6">
            {category.topics.map((topic) => {
              const isExpanded = visibleExpandedTopicIds.includes(topic.id);

              return (
                <div
                  key={topic.id}
                  className="rounded-[24px] border border-[#e3ebfd] bg-[linear-gradient(180deg,#f9fbff_0%,#ffffff_100%)]"
                >
                  <button
                    type="button"
                    onClick={() => toggleTopic(topic.id)}
                    className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left transition-colors hover:bg-[#f8fbff]"
                  >
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-[#334265]">
                        {topic.name}
                      </h3>
                      <p className="mt-1 text-sm text-[#6f7898]">
                        {topic.questions.length} асуулт
                      </p>
                    </div>
                    <ChevronDown
                      className={cn(
                        "h-4 w-4 shrink-0 text-[#7b8bb1] transition-transform",
                        isExpanded ? "rotate-180" : "",
                      )}
                    />
                  </button>

                  {isExpanded ? (
                    <div className="space-y-3 border-t border-[#e8eefb] px-4 py-4 sm:px-5">
                      {topic.questions.map((question, index) => (
                        <div
                          key={question.id}
                          className="rounded-[22px] border border-[#e7edfb] bg-white px-4 py-4 shadow-[0_8px_24px_rgba(177,198,232,0.08)]"
                        >
                          <div className="flex flex-wrap items-center gap-2 text-sm text-[#7080a0]">
                            <span>Асуулт {index + 1}</span>
                            <Badge
                              variant="outline"
                              className="border-[#dce7ff] bg-[#f8fbff] text-[#526488]"
                            >
                              {question.type}
                            </Badge>
                            <Badge
                              variant="secondary"
                              className="bg-[#eef4ff] text-[#4e6290]"
                            >
                              {getDifficultyLabel(question.difficulty)}
                            </Badge>
                            <span>{question.points} оноо</span>
                          </div>
                          <p className="mt-3 font-medium text-[#2f3d60]">
                            {question.question}
                          </p>
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
