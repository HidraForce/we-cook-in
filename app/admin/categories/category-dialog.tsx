"use client";

import { useActionState, useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { getPlanStyle } from "@/lib/plans";
import { createCategory, updateCategory, type CategoryFormState } from "./actions";
import { Loader2, Plus, Pencil } from "lucide-react";

type Plan = {
  id: string;
  slug: string;
  name: string;
};

type Category = {
  id: string;
  name: string;
  description: string | null;
  thumbnail_url: string | null;
  min_plan_id: string;
  sort_order: number;
  published: boolean;
};

type Props = {
  plans: Plan[];
  category?: Category;
};

export function CategoryDialog({ plans, category }: Props) {
  const isEditing = !!category;
  const action = isEditing ? updateCategory : createCategory;

  const [state, formAction, isPending] = useActionState<CategoryFormState, FormData>(
    action,
    {}
  );

  const [open, setOpen] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState(category?.min_plan_id ?? "");
  const selectedPlan = plans.find((p) => p.id === selectedPlanId);

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
            Nova Categoria
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Editar Categoria" : "Nova Categoria"}
          </DialogTitle>
        </DialogHeader>

        <form action={formAction} className="space-y-4">
          {isEditing && <input type="hidden" name="id" value={category.id} />}

          {state.error && (
            <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
              {state.error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">Nome *</Label>
            <Input
              id="name"
              name="name"
              placeholder="Ex: Culinária Básica"
              defaultValue={category?.name}
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Plano mínimo *</Label>
            <input type="hidden" name="min_plan_id" value={selectedPlanId} />
            <Select
              defaultValue={category?.min_plan_id}
              required
              onValueChange={setSelectedPlanId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o plano" />
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
              <p className="text-xs text-muted-foreground">
                Módulos desta categoria exigirão pelo menos o plano{" "}
                <Badge variant="outline" className={`text-[10px] px-1.5 py-0 ${getPlanStyle(selectedPlan.slug)}`}>
                  {selectedPlan.name}
                </Badge>
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Descreva esta categoria..."
              rows={3}
              defaultValue={category?.description ?? ""}
            />
          </div>

          <div className="grid gap-4 grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="sort_order">Ordem</Label>
              <Input
                id="sort_order"
                name="sort_order"
                type="number"
                min={0}
                defaultValue={category?.sort_order ?? 0}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="thumbnail_url">Thumbnail URL</Label>
              <Input
                id="thumbnail_url"
                name="thumbnail_url"
                placeholder="https://..."
                defaultValue={category?.thumbnail_url ?? ""}
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label htmlFor="published">Publicado</Label>
              <p className="text-xs text-muted-foreground">
                Categoria visível para alunos
              </p>
            </div>
            <Switch
              id="published"
              name="published"
              defaultChecked={category?.published ?? true}
            />
          </div>

          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isEditing ? "Salvar" : "Criar Categoria"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
