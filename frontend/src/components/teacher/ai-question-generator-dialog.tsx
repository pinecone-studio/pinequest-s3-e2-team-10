'use client'

import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { mockTests } from '@/lib/mock-data'

export function AIQuestionGeneratorDialog({
  aiMCCount,
  aiShortCount,
  aiTFCount,
  isGenerating,
  onGenerate,
  onOpenChange,
  onToggleTest,
  open,
  selectedMockTests,
  setAiMCCount,
  setAiShortCount,
  setAiTFCount,
}: {
  aiMCCount: number
  aiShortCount: number
  aiTFCount: number
  isGenerating: boolean
  onGenerate: () => void
  onOpenChange: (open: boolean) => void
  onToggleTest: (testId: string, checked: boolean) => void
  open: boolean
  selectedMockTests: string[]
  setAiMCCount: (value: number) => void
  setAiShortCount: (value: number) => void
  setAiTFCount: (value: number) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Generate Questions with AI</DialogTitle>
          <DialogDescription>Configure how many questions of each type to generate</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Select content from Question Bank</Label>
            <div className="space-y-2 max-h-32 overflow-auto border rounded p-2">
              {mockTests.map((test) => (
                <div key={test.id} className="flex items-center gap-2">
                  <Checkbox id={test.id} checked={selectedMockTests.includes(test.id)} onCheckedChange={(checked) => onToggleTest(test.id, Boolean(checked))} />
                  <label htmlFor={test.id} className="text-sm">{test.name}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <CountField label="Multiple Choice" value={aiMCCount} onChange={setAiMCCount} />
            <CountField label="True/False" value={aiTFCount} onChange={setAiTFCount} />
            <CountField label="Short Answer" value={aiShortCount} onChange={setAiShortCount} />
            <div className="space-y-2">
              <Label>Total Questions</Label>
              <div className="h-9 flex items-center px-3 border rounded-md bg-muted">
                {aiMCCount + aiTFCount + aiShortCount}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onGenerate} disabled={isGenerating}>
            {isGenerating ? 'Generating...' : 'Generate Questions'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function CountField({
  label,
  onChange,
  value,
}: {
  label: string
  onChange: (value: number) => void
  value: number
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <Input type="number" value={value} onChange={(e) => onChange(parseInt(e.target.value) || 0)} />
    </div>
  )
}
