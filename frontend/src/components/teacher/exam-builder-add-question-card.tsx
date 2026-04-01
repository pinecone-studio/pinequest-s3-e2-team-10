"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { QuestionType } from "@/components/teacher/exam-builder-types";

export function ExamBuilderAddQuestionCard({
  onAddQuestion,
}: {
  onAddQuestion: (type: QuestionType) => void;
}) {
  return (
    <Card>
      <CardContent className="py-4">
        <p className="mb-3 text-sm text-muted-foreground">
          Эсвэл өөр асуулт бэлдүүлэх
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddQuestion("multiple-choice")}
          >
            Сонгох хариулттай
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddQuestion("true-false")}
          >
            Үнэн / худал
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddQuestion("matching")}
          >
            Харгалзуулах
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddQuestion("ordering")}
          >
            Дараалуулах
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onAddQuestion("short-answer")}
          >
            Богино хариулт
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
