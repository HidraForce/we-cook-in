import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Video, MessageSquare, Heart, BookmarkCheck, Trophy } from "lucide-react";
import { ProfileEditor } from "./profile-editor";
import { FriendsSection } from "./friends-section";
import { resolveImageUrl } from "@/lib/image-url";

export default async function Profile() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) redirect("/onboarding");

  // Stats
  const [
    { count: lessonsCompleted },
    { count: postsCount },
    { count: commentsCount },
    { count: likesReceived },
    { count: savedCount },
  ] = await Promise.all([
    supabase
      .from("lesson_progress")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("completed", true),
    supabase
      .from("posts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("comments")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
    supabase
      .from("post_likes")
      .select("*, posts!inner(user_id)", { count: "exact", head: true })
      .eq("posts.user_id", user.id),
    supabase
      .from("saved_posts")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id),
  ]);

  // Friends
  const { data: friendships } = await supabase
    .from("friendships")
    .select("id, requester_id, addressee_id, status")
    .or(`requester_id.eq.${user.id},addressee_id.eq.${user.id}`)
    .eq("status", "accepted");

  const friendIds = (friendships ?? []).map((f) =>
    f.requester_id === user.id ? f.addressee_id : f.requester_id
  );

  const { data: friendProfiles } = friendIds.length > 0
    ? await supabase
        .from("profiles")
        .select("id, full_name, username, avatar_url")
        .in("id", friendIds)
    : { data: [] };

  const friends = (friendProfiles ?? []).map((fp) => {
    const friendship = (friendships ?? []).find(
      (f) =>
        (f.requester_id === fp.id && f.addressee_id === user.id) ||
        (f.addressee_id === fp.id && f.requester_id === user.id)
    );
    return { ...fp, friendship_id: friendship?.id ?? "" };
  });

  // Pending requests (where user is addressee)
  const { data: pendingFriendships } = await supabase
    .from("friendships")
    .select("id, requester_id")
    .eq("addressee_id", user.id)
    .eq("status", "pending");

  const pendingRequesterIds = (pendingFriendships ?? []).map((f) => f.requester_id);
  const { data: pendingProfiles } = pendingRequesterIds.length > 0
    ? await supabase
        .from("profiles")
        .select("id, full_name, username, avatar_url")
        .in("id", pendingRequesterIds)
    : { data: [] };

  const pendingRequests = (pendingProfiles ?? []).map((pp) => {
    const friendship = (pendingFriendships ?? []).find((f) => f.requester_id === pp.id);
    return { ...pp, friendship_id: friendship?.id ?? "" };
  });

  // Friends recent posts
  const { data: friendPosts } = friendIds.length > 0
    ? await supabase
        .from("posts")
        .select("id, title, category, created_at, profiles(full_name, avatar_url)")
        .in("user_id", friendIds)
        .order("created_at", { ascending: false })
        .limit(10)
    : { data: [] };

  const stats = [
    { icon: Trophy, label: "Aulas concluídas", value: lessonsCompleted ?? 0, color: "bg-amber-100 text-amber-600" },
    { icon: MessageSquare, label: "Posts", value: postsCount ?? 0, color: "bg-blue-100 text-blue-600" },
    { icon: Video, label: "Comentários", value: commentsCount ?? 0, color: "bg-green-100 text-green-600" },
    { icon: Heart, label: "Curtidas recebidas", value: likesReceived ?? 0, color: "bg-red-100 text-red-600" },
    { icon: BookmarkCheck, label: "Receitas salvas", value: savedCount ?? 0, color: "bg-purple-100 text-purple-600" },
  ];

  return (
    <div className="p-8 space-y-8 max-w-4xl mx-auto">
      <ProfileEditor
        profile={{
          id: profile.id,
          full_name: profile.full_name,
          username: profile.username,
          birth: profile.birth,
          address: profile.address,
          avatar_url: resolveImageUrl(profile.avatar_url),
          banner_url: resolveImageUrl(profile.banner_url),
        }}
        email={user.email ?? ""}
      />

      {/* Progress & Contributions */}
      <div>
        <h2 className="text-xl font-bold mb-4">Progresso & Contribuições</h2>
        <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          {stats.map((stat) => (
            <Card key={stat.label}>
              <CardContent className="p-4 flex flex-col items-center text-center gap-2">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.color}`}>
                  <stat.icon className="h-5 w-5" />
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Friends Section */}
      <div>
        <h2 className="text-xl font-bold mb-4">Amigos</h2>
        <FriendsSection
          friends={friends}
          pendingRequests={pendingRequests}
          friendPosts={(friendPosts ?? []) as any}
        />
      </div>
    </div>
  );
}
