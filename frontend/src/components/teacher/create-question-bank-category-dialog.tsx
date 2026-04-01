"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function CreateQuestionBankCategoryDialog(props: {
  isCreating: boolean;
  open: boolean;
  value: string;
  onCreate: () => void;
  onOpenChange: (open: boolean) => void;
  onValueChange: (value: string) => void;
}) {
  const { isCreating, open, value, onCreate, onOpenChange, onValueChange } = props;
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Шинэ ангилал үүсгэх</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="new-category-name">Ангиллын нэр</Label>
          <Input
            id="new-category-name"
            placeholder="Жишээ: Математик"
            value={value}
            onChange={(event) => onValueChange(event.target.value)}
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Болих</Button>
          <Button onClick={onCreate} disabled={isCreating}>
            {isCreating ? "Үүсгэж байна..." : "Үүсгэх"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
