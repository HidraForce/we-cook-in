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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getPlanStyle } from "@/lib/plans";
import { createModule, updateModule, type ModuleFormState } from "./actions";
import { Loader2 } from "lucide-react";

type Plan = {
  id: string;
  slug: string;
  name: string;
};

type Category = {
  id: string;
  name: string;
};

type Module = {
  id: string;
  name: string;
  description: string | null;
  category_id: string;
  min_plan_id: string | null;
  thumbnail_url: string | null;
  sort_order: number;
  published: boolean;
};

type Props = {
  categories: Category[];
  plans: Plan[];
  module?: Module;
};

export function ModuleForm({ categories, plans, module: mod }: Props) {
  const isEditing = !!mod;
  const action = isEditing ? updateModule : createModule;

  const [state, formAction, isPending] = useActionState<ModuleFormState, FormData>(
    action,
    {}
  );

  const [selectedPlanId, setSelectedPlanId] = useState(mod?.min_plan_id ?? "");
  const selectedPlan = plans.find((p) => p.id === selectedPlanId);

  return (
    <form action={formAction} className="space-y-8">
      {isEditing && <input type="hidden" name="id" value={mod.id} />}

      {state.error && (
        <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
          {state.error}
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Informações do Módulo</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome *</Label>
                <Input
                  id="name"
                  name="name"
                  placeholder="Ex: Fundamentos da Cozinha"
                  defaultValue={mod?.name}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category_id">Categoria *</Label>
                <Select name="category_id" defaultValue={mod?.category_id} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  name="description"
                  placeholder="Descreva o conteúdo deste módulo..."
                  rows={4}
                  defaultValue={mod?.description ?? ""}
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
                    defaultValue={mod?.sort_order ?? 0}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="thumbnail_url">URL da Thumbnail</Label>
                  <Input
                    id="thumbnail_url"
                    name="thumbnail_url"
                    placeholder="https://..."
                    defaultValue={mod?.thumbnail_url ?? ""}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Plano de Acesso *</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <input type="hidden" name="min_plan_id" value={selectedPlanId} />
              <Select
                defaultValue={mod?.min_plan_id ?? undefined}
                required
                onValueChange={setSelectedPlanId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o plano mínimo" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.id}>
                      <span className="flex items-center gap-2">
                        {plan.name}
                        <span
                          className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium border ${getPlanStyle(plan.slug)}`}
                        >
                          {plan.slug}
                        </span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedPlan && (
                <div className="pt-2">
                  <Badge
                    variant="outline"
                    className={`text-sm px-3 py-1 ${getPlanStyle(selectedPlan.slug)}`}
                  >
                    {selectedPlan.name}
                  </Badge>
                  <p className="text-xs text-muted-foreground mt-2">
                    Todas as aulas deste módulo exigirão o plano{" "}
                    <strong>{selectedPlan.name}</strong> ou superior.
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Publicação</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="published">Publicado</Label>
                  <p className="text-xs text-muted-foreground">
                    Módulo visível para alunos
                  </p>
                </div>
                <Switch
                  id="published"
                  name="published"
                  defaultChecked={mod?.published ?? false}
                />
              </div>
            </CardContent>
          </Card>

          <Button type="submit" className="w-full" size="lg" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Salvar Alterações" : "Criar Módulo"}
          </Button>
        </div>
      </div>
    </form>
  );
}
