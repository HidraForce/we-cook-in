"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export type ProfileFormState = {
  error?: string;
  success?: boolean;
};

export async function updateProfile(
  _prev: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Não autorizado." };

  const full_name = formData.get("full_name") as string;
  const username = formData.get("username") as string;

  if (!full_name || !username) {
    return { error: "Nome e usuário são obrigatórios." };
  }

  const avatar_url = (formData.get("avatar_url") as string) || null;
  const banner_url = (formData.get("banner_url") as string) || null;
  const birth = (formData.get("birth") as string) || null;
  const address = (formData.get("address") as string) || null;

  const { error } = await supabase
    .from("profiles")
    .update({
      full_name,
      username,
      avatar_url,
      banner_url,
      birth,
      address,
    })
    .eq("id", user.id);

  if (error) return { error: `Erro ao atualizar perfil: ${error.message}` };

  revalidatePath("/dashboard/profile");
  return { success: true };
}
