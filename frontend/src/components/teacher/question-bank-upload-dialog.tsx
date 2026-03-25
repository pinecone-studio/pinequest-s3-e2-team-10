'use client'

import * as React from 'react'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export function QuestionBankUploadDialog({
  isDialogOpen,
  isDragging,
  newTestName,
  onDragLeave,
  onDragOver,
  onDrop,
  onFileSelect,
  onOpenChange,
  onSubmit,
  selectedFile,
  setNewTestName,
  setSelectedFile,
}: {
  isDialogOpen: boolean
  isDragging: boolean
  newTestName: string
  onDragLeave: (e: React.DragEvent) => void
  onDragOver: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent) => void
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onOpenChange: (open: boolean) => void
  onSubmit: () => void
  selectedFile: File | null
  setNewTestName: (value: string) => void
  setSelectedFile: (value: File | null) => void
}) {
  return (
    <Dialog open={isDialogOpen} onOpenChange={onOpenChange}>
      <DialogTrigger asChild><Button>Upload New Test</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Upload Mock Test</DialogTitle>
          <DialogDescription>Add a new mock test file for your students to practice</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="testName">Test Name</Label>
            <Input id="testName" placeholder="e.g., HTML Basics Test, Semester 1 Mock" value={newTestName} onChange={(e) => setNewTestName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Test File (PDF or Word)</Label>
            <div className={isDragging ? 'border-2 border-dashed rounded-lg p-8 text-center transition-colors border-primary bg-primary/5' : 'border-2 border-dashed rounded-lg p-8 text-center transition-colors border-muted-foreground/25'} onDragOver={onDragOver} onDragLeave={onDragLeave} onDrop={onDrop}>
              {selectedFile ? (
                <div>
                  <p className="font-medium">{selectedFile.name}</p>
                  <p className="text-sm text-muted-foreground">{(selectedFile.size / 1024).toFixed(1)} KB</p>
                  <Button variant="ghost" size="sm" className="mt-2" onClick={() => setSelectedFile(null)}>Remove</Button>
                </div>
              ) : (
                <div>
                  <p className="text-muted-foreground mb-2">Drag and drop your file here, or</p>
                  <label htmlFor="fileInput">
                    <Button variant="outline" asChild><span>Choose File</span></Button>
                  </label>
                  <input id="fileInput" type="file" accept=".pdf,.doc,.docx" className="hidden" onChange={onFileSelect} />
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
          <Button onClick={onSubmit} disabled={!newTestName || !selectedFile}>Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
