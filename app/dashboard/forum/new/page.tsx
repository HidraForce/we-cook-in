"use client";

import { useActionState, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createPost, type PostFormState } from "../actions";
import { ArrowLeft, ImagePlus, Loader2, X } from "lucide-react";
import Link from "next/link";

export default function NewPost() {
  const [state, formAction, isPending] = useActionState<PostFormState, FormData>(
    createPost,
    {}
  );
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const [category, setCategory] = useState("tip");
  const fileInput = useRef<HTMLInputElement>(null);

  async function handleImageUpload(file: File) {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", "posts");
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setImageUrl(data.url);
      else alert(data.error || "Erro ao fazer upload");
    } catch {
      alert("Erro ao fazer upload");
    }
    setUploading(false);
  }

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/forum">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Novo Post</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Compartilhe com a comunidade</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={formAction} className="space-y-4">
            <input type="hidden" name="image_url" value={imageUrl} />
            <input type="hidden" name="category" value={category} />

            {state.error && (
              <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
                {state.error}
              </div>
            )}

            <div className="space-y-2">
              <Label>Tipo</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tip">Dica de Culinária</SelectItem>
                  <SelectItem value="recipe">Receita</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Título *</Label>
              <Input
                id="title"
                name="title"
                placeholder={
                  category === "recipe"
                    ? "Ex: Bolo de Cenoura da Vovó"
                    : "Ex: Como cortar cebola sem chorar"
                }
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="content">Conteúdo *</Label>
              <Textarea
                id="content"
                name="content"
                placeholder={
                  category === "recipe"
                    ? "Ingredientes, modo de preparo, tempo de cozimento..."
                    : "Descreva sua dica..."
                }
                rows={8}
                required
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <Label>Imagem (opcional)</Label>
              {imageUrl ? (
                <div className="relative">
                  <img
                    src={imageUrl}
                    alt="Preview"
                    className="w-full rounded-lg max-h-[300px] object-cover"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 h-8 w-8"
                    onClick={() => setImageUrl("")}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                  disabled={uploading}
                  className="w-full border-2 border-dashed rounded-lg p-8 flex flex-col items-center gap-2 text-muted-foreground hover:border-primary/50 hover:text-primary transition-colors cursor-pointer"
                >
                  {uploading ? (
                    <Loader2 className="h-8 w-8 animate-spin" />
                  ) : (
                    <ImagePlus className="h-8 w-8" />
                  )}
                  <span className="text-sm">
                    {uploading ? "Enviando..." : "Clique para adicionar uma imagem"}
                  </span>
                </button>
              )}
              <input
                ref={fileInput}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) handleImageUpload(f);
                }}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Publicar
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
