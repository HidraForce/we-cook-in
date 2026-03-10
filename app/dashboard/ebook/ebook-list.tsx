"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Download, Eye } from "lucide-react";
import { PdfReader } from "./pdf-reader";

type Ebook = {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string;
  thumbnail_url: string | null;
};

export function EbookList({ ebooks }: { ebooks: Ebook[] }) {
  const [selectedEbook, setSelectedEbook] = useState<Ebook | null>(null);

  if (selectedEbook) {
    return (
      <div className="space-y-4">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSelectedEbook(null)}
        >
          &larr; Voltar para a lista
        </Button>
        <PdfReader
          materialId={selectedEbook.id}
          fileName={selectedEbook.file_name}
          title={selectedEbook.title}
          onClose={() => setSelectedEbook(null)}
        />
      </div>
    );
  }

  if (ebooks.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <BookOpen className="h-16 w-16 text-muted-foreground/30 mb-4" />
        <h3 className="text-lg font-medium text-muted-foreground">
          Nenhum ebook disponível
        </h3>
        <p className="text-sm text-muted-foreground/70 mt-1">
          Os ebooks aparecerão aqui quando estiverem disponíveis.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {ebooks.map((ebook) => (
        <Card
          key={ebook.id}
          className="group overflow-hidden hover:shadow-md transition-shadow"
        >
          {ebook.thumbnail_url ? (
            <div className="aspect-3/4 max-h-[260px] overflow-hidden bg-muted">
              <img
                src={ebook.thumbnail_url}
                alt={ebook.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
          ) : (
            <div className="aspect-3/4 max-h-[260px] bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center">
              <BookOpen className="h-16 w-16 text-primary/30" />
            </div>
          )}
          <CardContent className="p-4 space-y-3">
            <div>
              <h3 className="font-semibold text-lg leading-tight line-clamp-2">
                {ebook.title}
              </h3>
              {ebook.description && (
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                  {ebook.description}
                </p>
              )}
            </div>
            <Badge variant="outline" className="text-xs">
              PDF
            </Badge>
            <div className="flex items-center gap-2 pt-1">
              <Button
                size="sm"
                className="flex-1"
                onClick={() => setSelectedEbook(ebook)}
              >
                <Eye className="mr-2 h-4 w-4" />
                Ler Agora
              </Button>
              <Button variant="outline" size="sm" asChild>
                <a href={`/api/materials/${ebook.id}?download=1`}>
                  <Download className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
