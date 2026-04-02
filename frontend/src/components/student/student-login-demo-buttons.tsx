"use client";

import { Button } from "@/components/ui/button";
import { judgeDemoStudents } from "@/lib/judge-demo-students";

export function StudentLoginDemoButtons({
  onDemoFill,
  onJudgeDemoFill,
}: {
  onDemoFill: () => void;
  onJudgeDemoFill: (email: string, password: string) => void;
}) {
  return (
    <>
      <Button type="button" variant="outline" className="w-full" onClick={onDemoFill}>
        Дэмо хэрэглэгч
      </Button>

      <div className="space-y-2 pt-2">
        <p className="text-sm font-medium text-foreground">Шүүгчдийн дэмо нэвтрэлт</p>
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
          {judgeDemoStudents.map((judge) => (
            <Button
              key={judge.id}
              type="button"
              variant="outline"
              className="h-auto whitespace-normal px-3 py-2 text-left"
              onClick={() => onJudgeDemoFill(judge.email, judge.password)}
            >
              {judge.name}
            </Button>
          ))}
        </div>
      </div>
    </>
  );
}
