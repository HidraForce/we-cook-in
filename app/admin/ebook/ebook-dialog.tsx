"use client";

import { useActionState, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createEbook, updateEbook, type EbookFormState } from "./actions";
import { Loader2, Plus, Pencil, FileText } from "lucide-react";

type Lesson = {
  id: string;
  title: string;
};

type Ebook = {
  id: string;
  title: string;
  description: string | null;
  file_url: string;
  file_name: string;
  thumbnail_url: string | null;
  lesson_id: string | null;
  sort_order: number;
  published: boolean;
};

type Props = {
  ebook?: Ebook;
  lessons?: Lesson[];
};

export function EbookDialog({ ebook, lessons = [] }: Props) {
  const isEditing = !!ebook;
  const action = isEditing ? updateEbook : createEbook;

  const [state, formAction, isPending] = useActionState<EbookFormState, FormData>(
    action,
    {}
  );

  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState(ebook?.file_name ?? "");
  const [selectedLessonId, setSelectedLessonId] = useState(ebook?.lesson_id ?? "");

  useEffect(() => {
    if (state.success) setOpen(false);
  }, [state.success]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {isEditing ? (
          <Button variant="ghost" size="sm">
            <Pencil className="h-4 w-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Novo Material
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Material" : "Novo Material"}
          </DialogTitle>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          {isEditing && (
            <>
              <input type="hidden" name="id" value={ebook.id} />
              <input type="hidden" name="existing_file_url" value={ebook.file_url} />
              <input type="hidden" name="existing_file_name" value={ebook.file_name} />
            </>
          )}

          {state.error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
              {state.error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="title">Título *</Label>
            <Input
              id="title"
              name="title"
              placeholder="Ex: Receitas Básicas"
              defaultValue={ebook?.title}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Descreva este material..."
              rows={3}
              defaultValue={ebook?.description ?? ""}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="file">Arquivo PDF {!isEditing && "*"}</Label>
            {isEditing && ebook.file_name && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground bg-muted/50 px-3 py-2 rounded-md">
                <FileText className="h-4 w-4 text-red-500 shrink-0" />
                <span className="truncate">{ebook.file_name}</span>
              </div>
            )}
            <Input
              id="file"
              name="file"
              type="file"
              accept=".pdf"
              required={!isEditing}
              onChange={(e) => {
                const f = e.target.files?.[0];
                setFileName(f?.name ?? "");
              }}
            />
            {fileName && !isEditing && (
              <p className="text-xs text-muted-foreground">
                Selecionado: {fileName}
              </p>
            )}
          </div>

          {lessons.length > 0 && (
            <div className="space-y-2">
              <Label>Vincular a uma aula (opcional)</Label>
              <input type="hidden" name="lesson_id" value={selectedLessonId} />
              <Select
                defaultValue={ebook?.lesson_id ?? ""}
                onValueChange={(val) =>
                  setSelectedLessonId(val === "none" ? "" : val)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Nenhuma aula vinculada" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Nenhuma</SelectItem>
                  {lessons.map((lesson) => (
                    <SelectItem key={lesson.id} value={lesson.id}>
                      {lesson.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Vincule este material a uma aula existente, se desejar.
              </p>
            </div>
          )}

          <div className="grid gap-4 grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sort_order">Ordem</Label>
              <Input
                id="sort_order"
                name="sort_order"
                type="number"
                min={0}
                defaultValue={ebook?.sort_order ?? 0}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
              <Input
                id="thumbnail_url"
                name="thumbnail_url"
                placeholder="https://..."
                defaultValue={ebook?.thumbnail_url ?? ""}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="published">Publicado</Label>
              <p className="text-xs text-muted-foreground">
                Visível para os alunos
              </p>
            </div>
            <Switch
              id="published"
              name="published"
              defaultChecked={ebook?.published ?? true}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Salvar" : "Criar Material"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
