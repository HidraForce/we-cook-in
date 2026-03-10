"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Video, Clock, FileText, Download, PlayCircle, CheckCircle2 } from "lucide-react";
import { getYouTubeEmbedUrl } from "@/lib/youtube";

type Lesson = {
  id: string;
  title: string;
  description: string | null;
  video_url: string | null;
  video_duration: number | null;
  material_url: string | null;
  material_name: string | null;
  is_preview: boolean;
  sort_order: number;
};

export function LessonViewer({ lessons }: { lessons: Lesson[] }) {
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(
    lessons[0] ?? null
  );

  if (lessons.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Video className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground">
          Nenhuma aula disponível neste módulo
        </h3>
      </div>
    );
  }

  const embedUrl = activeLesson?.video_url
    ? getYouTubeEmbedUrl(activeLesson.video_url)
    : null;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      {/* Video Player */}
      <div className="space-y-4">
        {embedUrl ? (
          <div className="aspect-video rounded-lg overflow-hidden bg-black">
            <iframe
              src={embedUrl}
              className="w-full h-full border-0"
              title={activeLesson?.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        ) : (
          <div className="aspect-video rounded-lg bg-muted flex items-center justify-center">
            <Video className="h-16 w-16 text-muted-foreground/30" />
          </div>
        )}

        {activeLesson && (
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold">{activeLesson.title}</h2>
                {activeLesson.description && (
                  <p className="text-muted-foreground mt-1">
                    {activeLesson.description}
                  </p>
                )}
              </div>
              {activeLesson.video_duration && (
                <Badge variant="outline" className="shrink-0 gap-1">
                  <Clock className="h-3 w-3" />
                  {activeLesson.video_duration}min
                </Badge>
              )}
            </div>

            {activeLesson.material_url && (
              <Card>
                <CardContent className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    <FileText className="h-5 w-5 text-red-500 shrink-0" />
                    <div>
                      <p className="text-sm font-medium">
                        {activeLesson.material_name ?? "Material da aula"}
                      </p>
                      <p className="text-xs text-muted-foreground">PDF</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href={activeLesson.material_url}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Baixar
                    </a>
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {/* Lesson List Sidebar */}
      <div className="space-y-2">
        <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wide px-1">
          Aulas ({lessons.length})
        </h3>
        <div className="space-y-1">
          {lessons.map((lesson, idx) => {
            const isActive = activeLesson?.id === lesson.id;

            return (
              <button
                key={lesson.id}
                onClick={() => setActiveLesson(lesson)}
                className={`w-full text-left px-3 py-3 rounded-lg transition-colors flex items-start gap-3 ${
                  isActive
                    ? "bg-primary/10 border border-primary/20"
                    : "hover:bg-muted/50"
                }`}
              >
                <span className="shrink-0 mt-0.5">
                  {isActive ? (
                    <PlayCircle className="h-5 w-5 text-primary" />
                  ) : (
                    <span className="flex items-center justify-center h-5 w-5 rounded-full bg-muted text-xs font-medium text-muted-foreground">
                      {idx + 1}
                    </span>
                  )}
                </span>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-medium leading-tight truncate ${
                      isActive ? "text-primary" : ""
                    }`}
                  >
                    {lesson.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    {lesson.video_duration && (
                      <span className="text-xs text-muted-foreground inline-flex items-center gap-0.5">
                        <Clock className="h-3 w-3" />
                        {lesson.video_duration}min
                      </span>
                    )}
                    {lesson.is_preview && (
                      <Badge variant="outline" className="text-[10px] px-1 py-0">
                        Grátis
                      </Badge>
                    )}
                    {lesson.material_url && (
                      <FileText className="h-3 w-3 text-red-400" />
                    )}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
