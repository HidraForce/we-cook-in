"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { revalidatePath } from "next/cache";

export type EbookFormState = {
  error?: string;
  success?: boolean;
};

const BUCKET = "lessons content";

type AdminClient = ReturnType<typeof createAdminClient>;

async function uploadMaterialFile(
  supabase: AdminClient,
  file: File,
  title: string
): Promise<string> {
  const timestamp = Date.now();
  const sanitized = title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const ext = file.name.split(".").pop() ?? "pdf";
  const path = `materials/${sanitized}-${timestamp}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(`Erro ao fazer upload: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

async function deleteMaterialFile(supabase: AdminClient, url: string) {
  try {
    const bucketSegment = encodeURIComponent(BUCKET);
    const parts = url.split(`/object/public/${bucketSegment}/`);
    if (parts.length < 2) return;
    const path = decodeURIComponent(parts[1]);
    await supabase.storage.from(BUCKET).remove([path]);
  } catch {
    // best-effort cleanup
  }
}

export async function createEbook(
  _prev: EbookFormState,
  formData: FormData
): Promise<EbookFormState> {
  const supabase = createAdminClient();

  const title = formData.get("title") as string;
  if (!title) return { error: "O título é obrigatório." };

  const file = formData.get("file") as File | null;
  if (!file || file.size === 0) {
    return { error: "O arquivo PDF é obrigatório." };
  }

  let file_url: string;
  try {
    file_url = await uploadMaterialFile(supabase, file, title);
  } catch (e) {
    return { error: (e as Error).message };
  }

  const lesson_id = (formData.get("lesson_id") as string) || null;

  const { error } = await supabase.from("materials").insert({
    title,
    description: (formData.get("description") as string) || null,
    file_url,
    file_name: file.name,
    thumbnail_url: (formData.get("thumbnail_url") as string) || null,
    lesson_id: lesson_id || null,
    sort_order: Number(formData.get("sort_order")) || 0,
    published: formData.get("published") === "on",
  });

  if (error) return { error: `Erro ao criar material: ${error.message}` };

  revalidatePath("/admin/ebook");
  revalidatePath("/dashboard/ebook");
  return { success: true };
}

export async function updateEbook(
  _prev: EbookFormState,
  formData: FormData
): Promise<EbookFormState> {
  const supabase = createAdminClient();

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  if (!id || !title) return { error: "O título é obrigatório." };

  let file_url: string | null =
    (formData.get("existing_file_url") as string) || null;
  let file_name: string | null =
    (formData.get("existing_file_name") as string) || null;

  const removeFile = formData.get("remove_file") === "on";
  const file = formData.get("file") as File | null;

  if (removeFile && file_url) {
    await deleteMaterialFile(supabase, file_url);
    file_url = null;
    file_name = null;
  }

  if (file && file.size > 0) {
    if (file_url) {
      await deleteMaterialFile(supabase, file_url);
    }
    try {
      file_url = await uploadMaterialFile(supabase, file, title);
      file_name = file.name;
    } catch (e) {
      return { error: (e as Error).message };
    }
  }

  if (!file_url) {
    return { error: "O material precisa de um arquivo PDF." };
  }

  const lesson_id = (formData.get("lesson_id") as string) || null;

  const { error } = await supabase
    .from("materials")
    .update({
      title,
      description: (formData.get("description") as string) || null,
      file_url,
      file_name,
      thumbnail_url: (formData.get("thumbnail_url") as string) || null,
      lesson_id: lesson_id || null,
      sort_order: Number(formData.get("sort_order")) || 0,
      published: formData.get("published") === "on",
    })
    .eq("id", id);

  if (error) return { error: `Erro ao atualizar material: ${error.message}` };

  revalidatePath("/admin/ebook");
  revalidatePath("/dashboard/ebook");
  return { success: true };
}

export async function deleteEbook(id: string): Promise<EbookFormState> {
  const supabase = createAdminClient();

  const { data: material } = await supabase
    .from("materials")
    .select("file_url")
    .eq("id", id)
    .single();

  if (material?.file_url) {
    await deleteMaterialFile(supabase, material.file_url);
  }

  const { error } = await supabase.from("materials").delete().eq("id", id);

  if (error) return { error: `Erro ao excluir material: ${error.message}` };

  revalidatePath("/admin/ebook");
  revalidatePath("/dashboard/ebook");
  return { success: true };
}
