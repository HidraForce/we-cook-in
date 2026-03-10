import { createClient } from "@/utils/supabase/server";
import { redirect, notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { PostCard } from "../post-card";
import { CommentSection } from "./comment-section";

export default async function PostDetail({
  params,
}: {
  params: Promise<{ postId: string }>;
}) {
  const { postId } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: post } = await supabase
    .from("posts")
    .select("*, profiles(full_name, username, avatar_url)")
    .eq("id", postId)
    .single();

  if (!post) notFound();

  const [{ data: likes }, { data: comments }, { data: userLike }, { data: userSave }, { data: friendships }] =
    await Promise.all([
      supabase.from("post_likes").select("id").eq("post_id", postId),
      supabase
        .from("comments")
        .select("*, profiles(full_name, username, avatar_url)")
        .eq("post_id", postId)
        .order("created_at", { ascending: true }),
      supabase
        .from("post_likes")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .single(),
      supabase
        .from("saved_posts")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", user.id)
        .single(),
      supabase
        .from("friendships")
        .select("requester_id, addressee_id")
        .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
        .eq("status", "accepted"),
    ]);

  const friendIdSet = new Set(
    (friendships ?? []).map((f) =>
      f.requester_id === user.id ? f.addressee_id : f.requester_id
    )
  );

  return (
    <div className="p-8 max-w-2xl mx-auto space-y-6">
      <Button variant="outline" size="sm" asChild>
        <Link href="/dashboard/forum">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar ao Fórum
        </Link>
      </Button>

      <PostCard
        post={{
          ...post,
          profiles: post.profiles as { full_name: string; username: string; avatar_url: string | null },
          like_count: (likes ?? []).length,
          comment_count: (comments ?? []).length,
        }}
        currentUserId={user.id}
        isLiked={!!userLike}
        isSaved={!!userSave}
        isFriend={friendIdSet.has(post.user_id)}
      />

      <Card>
        <CardContent className="p-4">
          <CommentSection
            postId={postId}
            comments={(comments ?? []).map((c) => ({
              ...c,
              profiles: c.profiles as { full_name: string; username: string; avatar_url: string | null },
            }))}
            currentUserId={user.id}
          />
        </CardContent>
      </Card>
    </div>
  );
}
