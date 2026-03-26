"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import type { MockTest } from "@/lib/mock-data";

const TOTAL_PAGES = 5;

export function StudentTestViewer({
  currentPage,
  onPageChange,
  onDownload,
  onPrint,
  test,
  zoom,
  onZoomChange,
}: {
  currentPage: number;
  onPageChange: (page: number | ((page: number) => number)) => void;
  onDownload: () => void;
  onPrint: () => void;
  test: MockTest;
  zoom: number;
  onZoomChange: (value: number) => void;
}) {
  return (
    <div className="h-[calc(100vh-8rem)] flex flex-col">
      <div className="flex items-center justify-between p-3 border-b bg-muted/30">
        <div className="flex items-center gap-4"><span className="font-medium">{test.name}</span></div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Zoom:</span>
            <Slider value={[zoom]} onValueChange={([value]) => onZoomChange(value)} min={50} max={200} step={10} className="w-24" />
            <span className="text-sm w-12">{zoom}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onDownload}>Download</Button>
            <Button variant="outline" size="sm" onClick={onPrint}>Print</Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        <div className="w-24 border-r bg-muted/20 p-2 overflow-auto">
          <div className="space-y-2">
            {Array.from({ length: TOTAL_PAGES }, (_, index) => (
              <button
                key={index}
                onClick={() => onPageChange(index + 1)}
                className={
                  currentPage === index + 1
                    ? "w-full aspect-[1/1.414] border rounded text-xs flex items-center justify-center transition-colors border-primary bg-primary/10 ring-2 ring-primary"
                    : "w-full aspect-[1/1.414] border rounded text-xs flex items-center justify-center transition-colors hover:bg-muted"
                }
              >
                <div className="text-center">
                  <div className="text-[10px] text-muted-foreground mb-1">Page</div>
                  <div className="font-medium">{index + 1}</div>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center overflow-auto bg-muted/10 p-4">
          <div className="flex items-center gap-4 mb-4 sticky top-0 bg-background/80 backdrop-blur py-2 px-4 rounded-full border">
            <Button variant="ghost" size="sm" disabled={currentPage === 1} onClick={() => onPageChange((page) => page - 1)}>&larr; Prev</Button>
            <span className="text-sm">Page <strong>{currentPage}</strong> of <strong>{TOTAL_PAGES}</strong></span>
            <Button variant="ghost" size="sm" disabled={currentPage === TOTAL_PAGES} onClick={() => onPageChange((page) => page + 1)}>Next &rarr;</Button>
          </div>

          <Card className="bg-background shadow-lg p-8 transition-transform origin-top" style={{ width: `${595 * (zoom / 100)}px`, minHeight: `${842 * (zoom / 100)}px` }}>
            <div className="h-full flex flex-col" style={{ fontSize: `${zoom}%` }}>
              {currentPage === 1 ? (
                <>
                  <div className="text-center mb-8">
                    <h1 className="text-xl font-bold mb-2">{test.name}</h1>
                    <p className="text-muted-foreground">Duration: 60 minutes</p>
                    <p className="text-muted-foreground">Total Marks: 100</p>
                  </div>
                  <div className="border-t pt-6 space-y-4">
                    <h2 className="font-semibold">Instructions:</h2>
                    <ul className="text-sm space-y-2 text-muted-foreground list-disc list-inside">
                      <li>Read all questions carefully before answering</li>
                      <li>Write your answers clearly and legibly</li>
                      <li>Show all working for calculation questions</li>
                      <li>Check your answers before submitting</li>
                    </ul>
                  </div>
                </>
              ) : (
                <div className="space-y-6">
                  <QuestionBlock number={(currentPage - 1) * 3 + 1} options={["A) Option one", "B) Option two", "C) Option three", "D) Option four"]} text="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua." />
                  <QuestionBlock number={(currentPage - 1) * 3 + 2} options={["A) True", "B) False"]} text="Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris." />
                  <QuestionBlock number={(currentPage - 1) * 3 + 3} text="Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore." />
                </div>
              )}
              <div className="mt-auto text-center text-sm text-muted-foreground">Page {currentPage} of {TOTAL_PAGES}</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

function QuestionBlock({
  number,
  options,
  text,
}: {
  number: number;
  options?: string[];
  text: string;
}) {
  return (
    <div>
      <h3 className="font-medium mb-2">Question {number}</h3>
      <p className="text-sm text-muted-foreground">{text}</p>
      {options ? (
        <div className="mt-2 ml-4 text-sm space-y-1">{options.map((option) => <p key={option}>{option}</p>)}</div>
      ) : (
        <div className="mt-2 border-b border-dashed h-12" />
      )}
    </div>
  );
}
