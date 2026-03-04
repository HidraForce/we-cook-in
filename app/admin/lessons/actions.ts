"use server";

import { createAdminClient } from "@/utils/supabase/admin";
import { redirect } from "next/navigation";

export type LessonFormState = {
  error?: string;
  success?: boolean;
};

const BUCKET = "lessons content";

type AdminClient = ReturnType<typeof createAdminClient>;

async function uploadMaterial(
  supabase: AdminClient,
  file: File,
  lessonTitle: string
): Promise<string> {
  const timestamp = Date.now();
  const sanitized = lessonTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
  const ext = file.name.split(".").pop() ?? "pdf";
  const path = `${sanitized}-${timestamp}.${ext}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });

  if (error) throw new Error(`Erro ao fazer upload: ${error.message}`);

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

async function deleteMaterial(supabase: AdminClient, url: string) {
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

export async function createLesson(
  _prev: LessonFormState,
  formData: FormData
): Promise<LessonFormState> {
  const supabase = createAdminClient();

  const title = formData.get("title") as string;
  const module_id = formData.get("module_id") as string;
  const video_url = formData.get("video_url") as string;

  if (!title || !module_id || !video_url) {
    return { error: "Título, módulo e URL do vídeo são obrigatórios." };
  }

  let material_url: string | null = null;
  let material_name: string | null = (formData.get("material_name") as string) || null;

  const file = formData.get("material_file") as File | null;
  if (file && file.size > 0) {
    try {
      material_url = await uploadMaterial(supabase, file, title);
      if (!material_name) material_name = file.name;
    } catch (e) {
      return { error: (e as Error).message };
    }
  }

  const { error } = await supabase.from("lessons").insert({
    module_id,
    title,
    description: (formData.get("description") as string) || null,
    video_url,
    video_duration: Number(formData.get("video_duration")) || null,
    material_url,
    material_name,
    is_preview: formData.get("is_preview") === "on",
    sort_order: Number(formData.get("sort_order")) || 0,
    published: formData.get("published") === "on",
  });

  if (error) {
    return { error: `Erro ao criar aula: ${error.message}` };
  }

  redirect("/admin/lessons");
}

export async function updateLesson(
  _prev: LessonFormState,
  formData: FormData
): Promise<LessonFormState> {
  const supabase = createAdminClient();

  const id = formData.get("id") as string;
  const title = formData.get("title") as string;
  const module_id = formData.get("module_id") as string;
  const video_url = formData.get("video_url") as string;

  if (!id || !title || !module_id || !video_url) {
    return { error: "Título, módulo e URL do vídeo são obrigatórios." };
  }

  let material_url: string | null =
    (formData.get("existing_material_url") as string) || null;
  let material_name: string | null =
    (formData.get("material_name") as string) || null;

  const removeMaterial = formData.get("remove_material") === "on";
  const file = formData.get("material_file") as File | null;

  if (removeMaterial && material_url) {
    await deleteMaterial(supabase, material_url);
    material_url = null;
    material_name = null;
  }

  if (file && file.size > 0) {
    if (material_url) {
      await deleteMaterial(supabase, material_url);
    }
    try {
      material_url = await uploadMaterial(supabase, file, title);
      if (!material_name) material_name = file.name;
    } catch (e) {
      return { error: (e as Error).message };
    }
  }

  const { error } = await supabase
    .from("lessons")
    .update({
      module_id,
      title,
      description: (formData.get("description") as string) || null,
      video_url,
      video_duration: Number(formData.get("video_duration")) || null,
      material_url,
      material_name,
      is_preview: formData.get("is_preview") === "on",
      sort_order: Number(formData.get("sort_order")) || 0,
      published: formData.get("published") === "on",
    })
    .eq("id", id);

  if (error) {
    return { error: `Erro ao atualizar aula: ${error.message}` };
  }

  redirect("/admin/lessons");
}

export async function deleteLesson(id: string): Promise<LessonFormState> {
  const supabase = createAdminClient();

  const { data: lesson } = await supabase
    .from("lessons")
    .select("material_url")
    .eq("id", id)
    .single();

  if (lesson?.material_url) {
    await deleteMaterial(supabase, lesson.material_url);
  }

  const { error } = await supabase.from("lessons").delete().eq("id", id);

  if (error) {
    return { error: `Erro ao excluir aula: ${error.message}` };
  }

  redirect("/admin/lessons");
}
