"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Download, Maximize2, Minimize2 } from "lucide-react";

type Props = {
  materialId: string;
  fileName: string;
  title: string;
  onClose: () => void;
};

export function PdfReader({ materialId, fileName, title, onClose }: Props) {
  const [fullscreen, setFullscreen] = useState(false);

  const viewUrl = `/api/materials/${materialId}`;

  return (
    <div
      className={
        fullscreen
          ? "fixed inset-0 z-50 bg-background flex flex-col"
          : "flex flex-col h-[80vh] rounded-lg border overflow-hidden bg-background"
      }
    >
      <div className="flex items-center justify-between px-4 py-3 border-b bg-muted/30 shrink-0">
        <h3 className="font-semibold truncate mr-4">{title}</h3>
        <div className="flex items-center gap-2 shrink-0">
          <Button variant="ghost" size="sm" asChild>
            <a href={`/api/materials/${materialId}?download=1`} title="Download PDF">
              <Download className="h-4 w-4" />
            </a>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setFullscreen(!fullscreen)}
            title={fullscreen ? "Sair da tela cheia" : "Tela cheia"}
          >
            {fullscreen ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </Button>
          <Button variant="ghost" size="sm" onClick={onClose} title="Fechar">
            <X className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="flex-1 min-h-0">
        <iframe
          src={`${viewUrl}#toolbar=1&navpanes=1&scrollbar=1`}
          className="w-full h-full border-0"
          title={title}
        />
      </div>
    </div>
  );
}
