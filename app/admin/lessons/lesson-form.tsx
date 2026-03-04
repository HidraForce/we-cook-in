"use client";

import { useActionState, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getYouTubeEmbedUrl } from "@/lib/youtube";
import { getPlanStyle } from "@/lib/plans";
import { createLesson, updateLesson, type LessonFormState } from "./actions";
import { Loader2, FileText, Upload, X } from "lucide-react";

type Plan = {
  id: string;
  slug: string;
  name: string;
};

type Module = {
  id: string;
  name: string;
  category_id: string;
  min_plan_id: string | null;
};

type Category = {
  id: string;
  name: string;
};

type Lesson = {
  id: string;
  module_id: string;
  title: string;
  description: string | null;
  video_url: string;
  video_duration: number | null;
  material_url: string | null;
  material_name: string | null;
  is_preview: boolean;
  sort_order: number;
  published: boolean;
};

type Props = {
  modules: Module[];
  categories: Category[];
  plans: Plan[];
  lesson?: Lesson;
};

export function LessonForm({ modules, categories, plans, lesson }: Props) {
  const isEditing = !!lesson;
  const action = isEditing ? updateLesson : createLesson;

  const [state, formAction, isPending] = useActionState<LessonFormState, FormData>(
    action,
    {}
  );

  const [videoUrl, setVideoUrl] = useState(lesson?.video_url ?? "");
  const [selectedModuleId, setSelectedModuleId] = useState(lesson?.module_id ?? "");
  const [removeMaterial, setRemoveMaterial] = useState(false);
  const embedUrl = getYouTubeEmbedUrl(videoUrl);

  const planMap = new Map(plans.map((p) => [p.id, p]));

  const selectedModule = modules.find((m) => m.id === selectedModuleId);
  const selectedPlan = selectedModule?.min_plan_id
    ? planMap.get(selectedModule.min_plan_id)
    : null;

  const modulesByCategory = categories.map((cat) => ({
    ...cat,
    modules: modules.filter((m) => m.category_id === cat.id),
  }));

  return (
    <form action={formAction} className="space-y-8">
      {isEditing && <input type="hidden" name="id" value={lesson.id} />}

      {state.error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
          {state.error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações da Aula</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Título *</Label>
                <Input
                  id="title"
                  name="title"
                  placeholder="Ex: Como fazer massa fresca"
                  defaultValue={lesson?.title}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="module_id">Módulo *</Label>
                <input type="hidden" name="module_id" value={selectedModuleId} />
                <Select
                  defaultValue={lesson?.module_id}
                  required
                  onValueChange={setSelectedModuleId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um módulo" />
                  </SelectTrigger>
                  <SelectContent>
                    {modulesByCategory.map((cat) =>
                      cat.modules.length > 0 ? (
                        <SelectGroup key={cat.id}>
                          <SelectLabel>{cat.name}</SelectLabel>
                          {cat.modules.map((mod) => {
                            const plan = mod.min_plan_id
                              ? planMap.get(mod.min_plan_id)
                              : null;
                            return (
                              <SelectItem key={mod.id} value={mod.id}>
                                <span className="flex items-center gap-2">
                                  {mod.name}
                                  {plan && (
                                    <span
                                      className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium border ${getPlanStyle(plan.slug)}`}
                                    >
                                      {plan.name}
                                    </span>
                                  )}
                                </span>
                              </SelectItem>
                            );
                          })}
                        </SelectGroup>
                      ) : null
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Descreva o conteúdo desta aula..."
                  rows={4}
                  defaultValue={lesson?.description ?? ""}
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sort_order">Ordem</Label>
                  <Input
                    id="sort_order"
                    name="sort_order"
                    type="number"
                    min={0}
                    defaultValue={lesson?.sort_order ?? 0}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="video_duration">Duração (minutos)</Label>
                  <Input
                    id="video_duration"
                    name="video_duration"
                    type="number"
                    min={0}
                    placeholder="Ex: 15"
                    defaultValue={lesson?.video_duration ?? ""}
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Vídeo (YouTube)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="video_url">URL do YouTube *</Label>
                <Input
                  id="video_url"
                  name="video_url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={videoUrl}
                  onChange={(e) => setVideoUrl(e.target.value)}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Cole o link do vídeo não listado do YouTube
                </p>
              </div>

              {embedUrl && (
                <div className="space-y-2">
                  <Label>Preview</Label>
                  <div className="aspect-video rounded-lg overflow-hidden border bg-muted">
                    <iframe
                      src={embedUrl}
                      title="Video preview"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Material Complementar (PDF)</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {lesson?.material_url && !removeMaterial && (
                <>
                  <input
                    type="hidden"
                    name="existing_material_url"
                    value={lesson.material_url}
                  />
                  <div className="flex items-center gap-3 p-3 rounded-lg border bg-muted/50">
                    <FileText className="h-8 w-8 text-red-500 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate">
                        {lesson.material_name || "Material anexado"}
                      </p>
                      <a
                        href={lesson.material_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-primary hover:underline"
                      >
                        Ver arquivo
                      </a>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="text-destructive hover:text-destructive shrink-0"
                      onClick={() => setRemoveMaterial(true)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              )}

              {removeMaterial && (
                <input type="hidden" name="remove_material" value="on" />
              )}

              <div className="space-y-2">
                <Label htmlFor="material_name">Nome do Material</Label>
                <Input
                  id="material_name"
                  name="material_name"
                  placeholder="Ex: Receita em PDF"
                  defaultValue={lesson?.material_name ?? ""}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="material_file">
                  {lesson?.material_url && !removeMaterial
                    ? "Substituir arquivo"
                    : "Arquivo PDF"}
                </Label>
                <div className="relative">
                  <Input
                    id="material_file"
                    name="material_file"
                    type="file"
                    accept=".pdf,application/pdf"
                    className="file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1 file:text-xs file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
                  />
                </div>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <Upload className="h-3 w-3" />
                  O PDF será enviado para o armazenamento da plataforma
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nível de Acesso</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedPlan ? (
                <div className="space-y-3">
                  <Badge
                    variant="outline"
                    className={`text-sm px-3 py-1 ${getPlanStyle(selectedPlan.slug)}`}
                  >
                    {selectedPlan.name}
                  </Badge>
                  <p className="text-xs text-muted-foreground">
                    Definido pelo módulo selecionado. Alunos precisam do plano{" "}
                    <strong>{selectedPlan.name}</strong> ou superior para acessar.
                  </p>
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  Selecione um módulo para ver o nível de acesso.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Publicação</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="published">Publicado</Label>
                  <p className="text-xs text-muted-foreground">
                    Aula visível para alunos
                  </p>
                </div>
                <Switch
                  id="published"
                  name="published"
                  defaultChecked={lesson?.published ?? false}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="is_preview">Aula gratuita</Label>
                  <p className="text-xs text-muted-foreground">
                    Disponível sem assinatura
                  </p>
                </div>
                <Switch
                  id="is_preview"
                  name="is_preview"
                  defaultChecked={lesson?.is_preview ?? false}
                />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" size="lg" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Salvar Alterações" : "Criar Aula"}
          </Button>
        </div>
      </div>
    </form>
  );
}
