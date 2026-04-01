"use client";

import { AIQuestionSettingsPanel } from "@/components/teacher/ai-question-settings-panel";
import { AIQuestionSourceSelector } from "@/components/teacher/ai-question-source-selector";
import {
  type QuestionGeneratorPayload,
} from "@/components/teacher/ai-question-generator-dialog-types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAiQuestionGeneratorCard } from "@/hooks/use-ai-question-generator-card";
import { FileStack, Sparkles } from "lucide-react";
import type { UploadRecord } from "@/lib/uploads-api";
import { cn } from "@/lib/utils";

type Props = {
  availableSourceFiles: UploadRecord[];
  className?: string;
  isGenerating: boolean;
  onGenerate: (payload: QuestionGeneratorPayload) => void | Promise<void>;
  onToggleTest: (testId: string, checked: boolean) => void;
  selectedMockTests: string[];
};

export function AIQuestionGeneratorCard({
  availableSourceFiles,
  className,
  isGenerating,
  onGenerate,
  onToggleTest,
  selectedMockTests,
}: Props) {
  const card = useAiQuestionGeneratorCard(selectedMockTests);

  return (
    <Card
      className={cn(
        "border-[#d7e3ff] bg-[linear-gradient(180deg,#ffffff_0%,#f7fbff_100%)] shadow-[0_24px_80px_rgba(77,123,255,0.12)]",
        className,
      )}
    >
      <CardHeader className="space-y-4 rounded-t-[inherit] border-b border-[#dfe9ff] bg-[radial-gradient(circle_at_top_left,rgba(116,156,255,0.18),transparent_42%),linear-gradient(180deg,rgba(245,249,255,0.96)_0%,rgba(255,255,255,0.96)_100%)]">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-3">
            <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[#edf4ff] text-[#4b83f5] shadow-inner">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-2xl text-[#20335f]">
                AI асуулт үүсгэх
              </CardTitle>
              <p className="mt-2 max-w-sm text-sm leading-6 text-[#64748b]">
                Мэдлэгийн сан дээр тулгуурлаад асуултуудыг шууд ноорог руу
                үүсгэнэ. Үүссэн асуулт бүр баруун талд бүрэн засварлагдана.
              </p>
            </div>
          </div>
          <div className="hidden rounded-2xl border border-white/80 bg-white/80 px-4 py-3 text-right shadow-sm lg:block">
            <div className="text-xs uppercase tracking-[0.18em] text-[#8aa0d2]">
              AI draft
            </div>
            <div className="mt-1 text-2xl font-semibold text-[#20335f]">
              {card.totalQuestionCount * card.variants}
            </div>
            <div className="text-xs text-[#7b8bb1]">үүсэх асуулт</div>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-[#dbe7ff] bg-white/80 px-4 py-3 text-sm text-[#4a5f8f]">
          <FileStack className="h-4 w-4 text-[#5b91fc]" />
          Эх сурвалж болон тохиргоогоо сонгоод AI-аар шууд асуулт бэлдүүлээрэй.
        </div>
      </CardHeader>

      <CardContent className="space-y-6 p-6">
        <AIQuestionSourceSelector
          availableSourceFiles={availableSourceFiles}
          isBuilderDialog={false}
          isDragging={card.isDragging}
          onDragEnter={card.handleDragOver}
          onDragLeave={card.handleDragLeave}
          onDragOver={card.handleDragOver}
          onDrop={card.handleDrop}
          onFileSelect={card.handleFileSelect}
          onRemoveBuilderFile={() => {}}
          onRemoveLocalFile={card.removeSourceFile}
          onToggleTest={onToggleTest}
          onUpdatePageRange={card.updatePageRange}
          selectedBuilderFiles={[]}
          selectedMockTests={selectedMockTests}
          sourceFilesWithPages={card.sourceFilesWithPages}
        />

        <AIQuestionSettingsPanel
          difficulty={card.difficulty}
          onDifficultyChange={card.setDifficulty}
          onQuestionTypeCountChange={card.updateQuestionTypeCount}
          onVariantsChange={card.setVariants}
          questionTypeCounts={card.questionTypeCounts}
          totalQuestionCount={card.totalQuestionCount}
          variants={card.variants}
        />

        <Button
          className="h-12 w-full rounded-2xl text-base"
          disabled={isGenerating || !card.hasSource || card.totalQuestionCount === 0}
          onClick={() =>
            void onGenerate({
              difficulty: card.difficulty,
              questionTypeCounts: card.questionTypeCounts,
              selectedMockTests,
              sourceFilesWithPages: card.sourceFilesWithPages,
              variants: card.variants,
            })
          }
        >
          <Sparkles className="mr-2 h-4 w-4" />
          {isGenerating
            ? "AI асуулт бэлдэж байна..."
            : `${card.totalQuestionCount * card.variants} асуулт бэлдүүлэх`}
        </Button>
      </CardContent>
    </Card>
  );
}
