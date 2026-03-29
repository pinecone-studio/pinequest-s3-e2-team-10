"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import {
  deleteUpload,
  listUploads,
  uploadFile,
  type UploadRecord,
} from "@/lib/uploads-api";
import { FileText, Loader2, Upload, X } from "lucide-react";

const SOURCES_FOLDER = "sources";

export default function SourcesPage() {
  const [files, setFiles] = useState<UploadRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  useEffect(() => {
    let isMounted = true;

    const loadFiles = async () => {
      try {
        const uploadedFiles = await listUploads(SOURCES_FOLDER);
        if (!isMounted) return;
        setFiles(uploadedFiles);
      } catch (error) {
        if (!isMounted) return;
        toast({
          title: "Алдаа",
          description:
            error instanceof Error
              ? error.message
              : "Медлэгийн сангийн файлуудыг ачаалж чадсангүй.",
          variant: "destructive",
        });
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    void loadFiles();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      setNewFileName(file.name);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile || !newFileName.trim()) {
      toast({
        title: "Алдаа",
        description: "Файл сонгоод нэр оруулна уу.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const createdFile = await uploadFile({
        file: selectedFile,
        fileName: newFileName.trim(),
        folder: SOURCES_FOLDER,
      });

      setFiles((prev) => [createdFile, ...prev]);
      setSelectedFile(null);
      setNewFileName("");

      toast({
        title: "Амжилттай",
        description: "Файл медлэгийн санд хадгалагдлаа.",
      });
    } catch (error) {
      toast({
        title: "Алдаа",
        description:
          error instanceof Error ? error.message : "Файл хуулахад алдаа гарлаа.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (fileId: string) => {
    try {
      await deleteUpload(fileId);
      setFiles((prev) => prev.filter((file) => file.id !== fileId));

      toast({
        title: "Амжилттай",
        description: "Файл устгагдлаа.",
      });
    } catch (error) {
      toast({
        title: "Алдаа",
        description:
          error instanceof Error ? error.message : "Файл устгаж чадсангүй.",
        variant: "destructive",
      });
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Медлэгийн сан</h1>
        <p className="text-muted-foreground">
          Асуулт үүсгэхдээ ашиглах материал, ном, файлууд.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Шинэ файл нэмэх
          </CardTitle>
          <CardDescription>
            PDF, Word зэрэг файлуудыг хадгалж, дараа нь асуулт үүсгэхдээ
            ашиглана.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="file-name">Файлын нэр</Label>
              <Input
                id="file-name"
                placeholder="Жишээ: 7-р ангийн алгебрын томьёо"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="file-upload">Файл сонгох</Label>
              <Input
                id="file-upload"
                type="file"
                accept=".pdf,.doc,.docx,.txt"
                onChange={handleFileSelect}
              />
            </div>
          </div>

          {selectedFile ? (
            <div className="rounded-lg bg-muted p-3">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                <span className="text-sm font-medium">{selectedFile.name}</span>
                <span className="text-sm text-muted-foreground">
                  ({formatFileSize(selectedFile.size)})
                </span>
              </div>
            </div>
          ) : null}

          <Button
            onClick={handleUpload}
            disabled={!selectedFile || !newFileName.trim() || isUploading}
            className="w-full md:w-auto"
          >
            {isUploading ? "Хуулж байна..." : "Файл хуулах"}
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Хуулсан файлууд ({files.length})</CardTitle>
          <CardDescription>
            Эдгээр файлууд Асуултын сан дахь AI үүсгэлтэд шууд харагдана.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center gap-2 py-8 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Файлуудыг ачаалж байна...
            </div>
          ) : files.length === 0 ? (
            <div className="py-8 text-center text-muted-foreground">
              <FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>Одоогоор файл алга байна.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {files.map((file) => (
                <div
                  key={file.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center gap-3">
                    <FileText className="h-8 w-8 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{file.originalName}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(file.size)} • Хуулсан:{" "}
                        {new Date(file.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => void handleDelete(file.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
