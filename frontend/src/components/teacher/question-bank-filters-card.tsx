"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { QuestionBankCategory } from "@/lib/question-bank-api";
import { Search } from "lucide-react";

export const CREATE_CATEGORY_FILTER_VALUE = "__create_category__";

type QuestionBankFiltersCardProps = {
  onSearchQueryChange: (value: string) => void;
  onSelectedCategoryFilterChange: (value: string) => void;
  onSelectedDifficultyChange: (value: string) => void;
  questionBank: QuestionBankCategory[];
  searchQuery: string;
  selectedCategoryFilter: string;
  selectedDifficulty: string;
};

export function QuestionBankFiltersCard({
  onSearchQueryChange,
  onSelectedCategoryFilterChange,
  onSelectedDifficultyChange,
  questionBank,
  searchQuery,
  selectedCategoryFilter,
  selectedDifficulty,
}: QuestionBankFiltersCardProps) {
  return (
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
                onChange={(event) => onSearchQueryChange(event.target.value)}
              />
            </div>
          </div>

          <Select
            value={selectedCategoryFilter}
            onValueChange={onSelectedCategoryFilterChange}
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
              <SelectItem value={CREATE_CATEGORY_FILTER_VALUE}>
                + Шинэ ангилал нэмэх
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={selectedDifficulty} onValueChange={onSelectedDifficultyChange}>
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
      </CardContent>
    </Card>
  );
}
