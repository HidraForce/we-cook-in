"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { redirect } from "next/navigation";

export type ModuleFormState = {
  error?: string;
  success?: boolean;
};

export async function createModule(
  _prev: ModuleFormState,
  formData: FormData
): Promise<ModuleFormState> {
  const supabase = createAdminClient();

  const name = formData.get("name") as string;
  const category_id = formData.get("category_id") as string;
  const min_plan_id = formData.get("min_plan_id") as string;

  if (!name || !category_id || !min_plan_id) {
    return { error: "Nome, categoria e plano são obrigatórios." };
  }

  const { error } = await supabase.from("modules").insert({
    name,
    category_id,
    min_plan_id,
    description: (formData.get("description") as string) || null,
    thumbnail_url: (formData.get("thumbnail_url") as string) || null,
    sort_order: Number(formData.get("sort_order")) || 0,
    published: formData.get("published") === "on",
  });

  if (error) {
    return { error: `Erro ao criar módulo: ${error.message}` };
  }

  redirect("/admin/modules");
}

export async function updateModule(
  _prev: ModuleFormState,
  formData: FormData
): Promise<ModuleFormState> {
  const supabase = createAdminClient();

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const category_id = formData.get("category_id") as string;
  const min_plan_id = formData.get("min_plan_id") as string;

  if (!id || !name || !category_id || !min_plan_id) {
    return { error: "Nome, categoria e plano são obrigatórios." };
  }

  const { error } = await supabase
    .from("modules")
    .update({
      name,
      category_id,
      min_plan_id,
      description: (formData.get("description") as string) || null,
      thumbnail_url: (formData.get("thumbnail_url") as string) || null,
      sort_order: Number(formData.get("sort_order")) || 0,
      published: formData.get("published") === "on",
    })
    .eq("id", id);

  if (error) {
    return { error: `Erro ao atualizar módulo: ${error.message}` };
  }

  redirect("/admin/modules");
}

export async function deleteModule(id: string): Promise<ModuleFormState> {
  const supabase = createAdminClient();

  const { error } = await supabase.from("modules").delete().eq("id", id);

  if (error) {
    return { error: `Erro ao excluir módulo: ${error.message}` };
  }

  redirect("/admin/modules");
}
