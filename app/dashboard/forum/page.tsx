import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Plus, MessageSquare } from "lucide-react";
import Link from "next/link";
import { PostCard } from "./post-card";

export default async function Forum() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: posts } = await supabase
    .from("posts")
    .select("*, profiles(full_name, username, avatar_url)")
    .order("created_at", { ascending: false });

  // Get like counts
  const postIds = (posts ?? []).map((p) => p.id);

  const { data: likeCounts } = postIds.length > 0
    ? await supabase
        .from("post_likes")
        .select("post_id")
        .in("post_id", postIds)
    : { data: [] };

  const { data: commentCounts } = postIds.length > 0
    ? await supabase
        .from("comments")
        .select("post_id")
        .in("post_id", postIds)
    : { data: [] };

  // User's likes and saves
  const { data: userLikes } = await supabase
    .from("post_likes")
    .select("post_id")
    .eq("user_id", user.id);

  const { data: userSaves } = await supabase
    .from("saved_posts")
    .select("post_id")
    .eq("user_id", user.id);

  // User's friends
  const { data: friendships } = await supabase
    .from("friendships")
    .select("requester_id, addressee_id")
    .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
    .eq("status", "accepted");

  const friendIdSet = new Set(
    (friendships ?? []).map((f) =>
      f.requester_id === user.id ? f.addressee_id : f.requester_id
    )
  );

  const likedSet = new Set((userLikes ?? []).map((l) => l.post_id));
  const savedSet = new Set((userSaves ?? []).map((s) => s.post_id));

  const likeCountMap = new Map<string, number>();
  (likeCounts ?? []).forEach((l) => {
    likeCountMap.set(l.post_id, (likeCountMap.get(l.post_id) ?? 0) + 1);
  });

  const commentCountMap = new Map<string, number>();
  (commentCounts ?? []).forEach((c) => {
    commentCountMap.set(c.post_id, (commentCountMap.get(c.post_id) ?? 0) + 1);
  });

  return (
    <div className="p-8 space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Fórum</h1>
          <p className="text-muted-foreground mt-1">
            Compartilhe dicas e receitas com a comunidade.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/forum/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Post
          </Link>
        </Button>
      </div>

      {posts && posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <PostCard
              key={post.id}
              post={{
                ...post,
                profiles: post.profiles as { full_name: string; username: string; avatar_url: string | null },
                like_count: likeCountMap.get(post.id) ?? 0,
                comment_count: commentCountMap.get(post.id) ?? 0,
              }}
              currentUserId={user.id}
              isLiked={likedSet.has(post.id)}
              isSaved={savedSet.has(post.id)}
              isFriend={friendIdSet.has(post.user_id)}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <MessageSquare className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">
            Nenhum post ainda
          </h3>
          <p className="text-sm text-muted-foreground/70 mt-1 mb-4">
            Seja o primeiro a compartilhar uma dica ou receita!
          </p>
          <Button asChild>
            <Link href="/dashboard/forum/new">
              <Plus className="mr-2 h-4 w-4" />
              Criar Post
            </Link>
          </Button>
        </div>
      )}
    </div>
  );
}
