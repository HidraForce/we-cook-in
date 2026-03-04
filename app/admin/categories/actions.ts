"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";

export type CategoryFormState = {
  error?: string;
  success?: boolean;
};

export async function createCategory(
  _prev: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const supabase = createAdminClient();

  const name = formData.get("name") as string;
  const min_plan_id = formData.get("min_plan_id") as string;
  if (!name || !min_plan_id) return { error: "Nome e plano são obrigatórios." };

  const { error } = await supabase.from("categories").insert({
    name,
    min_plan_id,
    description: (formData.get("description") as string) || null,
    thumbnail_url: (formData.get("thumbnail_url") as string) || null,
    sort_order: Number(formData.get("sort_order")) || 0,
    published: formData.get("published") === "on",
  });

  if (error) return { error: `Erro ao criar categoria: ${error.message}` };

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function updateCategory(
  _prev: CategoryFormState,
  formData: FormData
): Promise<CategoryFormState> {
  const supabase = createAdminClient();

  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const min_plan_id = formData.get("min_plan_id") as string;
  if (!id || !name || !min_plan_id) return { error: "Nome e plano são obrigatórios." };

  const { error } = await supabase
    .from("categories")
    .update({
      name,
      min_plan_id,
      description: (formData.get("description") as string) || null,
      thumbnail_url: (formData.get("thumbnail_url") as string) || null,
      sort_order: Number(formData.get("sort_order")) || 0,
      published: formData.get("published") === "on",
    })
    .eq("id", id);

  if (error) return { error: `Erro ao atualizar categoria: ${error.message}` };

  revalidatePath("/admin/categories");
  return { success: true };
}

export async function deleteCategory(id: string): Promise<CategoryFormState> {
  const supabase = createAdminClient();

  const { count } = await supabase
    .from("modules")
    .select("*", { count: "exact", head: true })
    .eq("category_id", id);

  if (count && count > 0) {
    return {
      error: `Não é possível excluir: existem ${count} módulo(s) nesta categoria.`,
    };
  }

  const { error } = await supabase.from("categories").delete().eq("id", id);

  if (error) return { error: `Erro ao excluir categoria: ${error.message}` };

  revalidatePath("/admin/categories");
  return { success: true };
}
