"use client";

import { ExamBuilderQuestionList } from "@/components/teacher/exam-builder-question-list";
import { CREATE_CATEGORY_OPTION } from "@/components/teacher/question-bank-builder-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles } from "lucide-react";
import type { NewQuestion, QuestionType } from "@/components/teacher/exam-builder-types";
import type { QuestionBankCategory } from "@/lib/question-bank-api";

type Props = {
  builderCategoryId: string;
  builderQuestions: NewQuestion[];
  builderTopicName: string;
  onAddQuestion: (type: QuestionType) => void;
  onCategoryChange: (value: string) => void;
  onCreateCategory: () => void;
  onRemoveQuestion: (id: string) => void;
  onTopicNameChange: (value: string) => void;
  onUpdateOption: (questionId: string, optionIndex: number, value: string) => void;
  onUpdateQuestion: (id: string, updates: Partial<NewQuestion>) => void;
  questionBank: QuestionBankCategory[];
};

export function QuestionBankCreateBuilderCard({
  builderCategoryId,
  builderQuestions,
  builderTopicName,
  onAddQuestion,
  onCategoryChange,
  onCreateCategory,
  onRemoveQuestion,
  onTopicNameChange,
  onUpdateOption,
  onUpdateQuestion,
  questionBank,
}: Props) {
  return (
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
            <Input
              id="topic-name"
              placeholder="Жишээ: Алгебр 7 томьёо"
              value={builderTopicName}
              onChange={(event) => onTopicNameChange(event.target.value)}
              className="h-12 text-base"
            />
          </div>
          <div className="space-y-2">
            <Label>Ангилал</Label>
            <Select
              value={builderCategoryId}
              onValueChange={(value) =>
                value === CREATE_CATEGORY_OPTION ? onCreateCategory() : onCategoryChange(value)
              }
            >
              <SelectTrigger className="h-12">
                <SelectValue placeholder="Ангилал сонгоно уу" />
              </SelectTrigger>
              <SelectContent>
                {questionBank.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
                <SelectItem value={CREATE_CATEGORY_OPTION}>+ Шинэ ангилал үүсгэх</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <ExamBuilderQuestionList
          onAddQuestion={onAddQuestion}
          onRemoveQuestion={onRemoveQuestion}
          onUpdateOption={onUpdateOption}
          onUpdateQuestion={onUpdateQuestion}
          questions={builderQuestions}
        />
      </CardContent>
    </Card>
  );
}
