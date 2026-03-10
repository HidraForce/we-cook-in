"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export type PostFormState = {
  error?: string;
  success?: boolean;
};

export async function createPost(
  _prev: PostFormState,
  formData: FormData
): Promise<PostFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autorizado." };

  const title = formData.get("title") as string;
  const content = formData.get("content") as string;
  const category = formData.get("category") as string;

  if (!title || !content) {
    return { error: "Título e conteúdo são obrigatórios." };
  }

  const image_url = (formData.get("image_url") as string) || null;

  const { error } = await supabase.from("posts").insert({
    user_id: user.id,
    title,
    content,
    category: category || "tip",
    image_url,
  });

  if (error) return { error: `Erro ao criar post: ${error.message}` };

  redirect("/dashboard/forum");
}

export async function deletePost(postId: string): Promise<PostFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autorizado." };

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId)
    .eq("user_id", user.id);

  if (error) return { error: `Erro ao excluir post: ${error.message}` };

  revalidatePath("/dashboard/forum");
  return { success: true };
}

export async function createComment(
  postId: string,
  content: string
): Promise<PostFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autorizado." };

  if (!content.trim()) return { error: "O comentário não pode ser vazio." };

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    user_id: user.id,
    content: content.trim(),
  });

  if (error) return { error: `Erro ao comentar: ${error.message}` };

  revalidatePath(`/dashboard/forum/${postId}`);
  return { success: true };
}

export async function deleteComment(commentId: string, postId: string): Promise<PostFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autorizado." };

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq("id", commentId)
    .eq("user_id", user.id);

  if (error) return { error: `Erro: ${error.message}` };

  revalidatePath(`/dashboard/forum/${postId}`);
  return { success: true };
}

export async function toggleLike(postId: string): Promise<PostFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autorizado." };

  const { data: existing } = await supabase
    .from("post_likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    await supabase.from("post_likes").delete().eq("id", existing.id);
  } else {
    await supabase.from("post_likes").insert({ post_id: postId, user_id: user.id });
  }

  revalidatePath("/dashboard/forum");
  revalidatePath(`/dashboard/forum/${postId}`);
  return { success: true };
}

export async function toggleSavePost(postId: string): Promise<PostFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autorizado." };

  const { data: existing } = await supabase
    .from("saved_posts")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .single();

  if (existing) {
    await supabase.from("saved_posts").delete().eq("id", existing.id);
  } else {
    await supabase.from("saved_posts").insert({ post_id: postId, user_id: user.id });
  }

  revalidatePath("/dashboard/forum");
  revalidatePath(`/dashboard/forum/${postId}`);
  return { success: true };
}

export async function sendFriendRequest(addresseeId: string): Promise<PostFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autorizado." };
  if (user.id === addresseeId) return { error: "Não pode adicionar a si mesmo." };

  const { data: existing } = await supabase
    .from("friendships")
    .select("id, status")
    .or(
      `and(requester_id.eq.${user.id},addressee_id.eq.${addresseeId}),and(requester_id.eq.${addresseeId},addressee_id.eq.${user.id})`
    )
    .single();

  if (existing) {
    if (existing.status === "accepted") return { error: "Vocês já são amigos." };
    if (existing.status === "pending") return { error: "Solicitação já enviada." };
  }

  const { error } = await supabase.from("friendships").insert({
    requester_id: user.id,
    addressee_id: addresseeId,
    status: "pending",
  });

  if (error) return { error: `Erro: ${error.message}` };

  revalidatePath("/dashboard/profile");
  return { success: true };
}

export async function respondFriendRequest(
  friendshipId: string,
  accept: boolean
): Promise<PostFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autorizado." };

  if (accept) {
    const { error } = await supabase
      .from("friendships")
      .update({ status: "accepted" })
      .eq("id", friendshipId)
      .eq("addressee_id", user.id);
    if (error) return { error: `Erro: ${error.message}` };
  } else {
    const { error } = await supabase
      .from("friendships")
      .delete()
      .eq("id", friendshipId)
      .eq("addressee_id", user.id);
    if (error) return { error: `Erro: ${error.message}` };
  }

  revalidatePath("/dashboard/profile");
  return { success: true };
}

export async function removeFriend(friendshipId: string): Promise<PostFormState> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Não autorizado." };

  const { error } = await supabase
    .from("friendships")
    .delete()
    .eq("id", friendshipId)
    .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`);

  if (error) return { error: `Erro: ${error.message}` };

  revalidatePath("/dashboard/profile");
  return { success: true };
}
