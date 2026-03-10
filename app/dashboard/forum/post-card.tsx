"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageSquare, Bookmark, Trash2, Loader2, UserPlus } from "lucide-react";
import { toggleLike, toggleSavePost, deletePost, sendFriendRequest } from "./actions";
import { resolveImageUrl } from "@/lib/image-url";
import Link from "next/link";

type PostCardProps = {
  post: {
    id: string;
    title: string;
    content: string;
    category: string;
    image_url: string | null;
    created_at: string;
    user_id: string;
    profiles: { full_name: string; username: string; avatar_url: string | null };
    like_count: number;
    comment_count: number;
  };
  currentUserId: string;
  isLiked: boolean;
  isSaved: boolean;
  isFriend: boolean;
};

export function PostCard({ post, currentUserId, isLiked, isSaved, isFriend }: PostCardProps) {
  const [liked, setLiked] = useState(isLiked);
  const [saved, setSaved] = useState(isSaved);
  const [likeCount, setLikeCount] = useState(post.like_count);
  const [loading, setLoading] = useState<string | null>(null);
  const isOwner = post.user_id === currentUserId;

  async function handleLike() {
    setLoading("like");
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    await toggleLike(post.id);
    setLoading(null);
  }

  async function handleSave() {
    setLoading("save");
    setSaved(!saved);
    await toggleSavePost(post.id);
    setLoading(null);
  }

  async function handleDelete() {
    if (!confirm("Excluir este post?")) return;
    setLoading("delete");
    await deletePost(post.id);
    setLoading(null);
  }

  async function handleAddFriend() {
    setLoading("friend");
    await sendFriendRequest(post.user_id);
    setLoading(null);
  }

  const timeAgo = getTimeAgo(post.created_at);

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 pb-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-muted overflow-hidden shrink-0">
              {post.profiles.avatar_url ? (
                <img src={resolveImageUrl(post.profiles.avatar_url)} alt="" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-sm font-bold text-muted-foreground">
                  {post.profiles.full_name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold">{post.profiles.full_name}</p>
                {!isOwner && !isFriend && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 px-1.5 text-xs"
                    disabled={loading === "friend"}
                    onClick={handleAddFriend}
                  >
                    <UserPlus className="h-3 w-3" />
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">
                @{post.profiles.username} · {timeAgo}
              </p>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            {post.category === "recipe" ? "Receita" : "Dica"}
          </Badge>
        </div>

        {/* Content */}
        <div className="p-4">
          <Link href={`/dashboard/forum/${post.id}`} className="block group">
            <h3 className="font-bold text-lg group-hover:text-primary transition-colors">
              {post.title}
            </h3>
            <p className="text-muted-foreground mt-1 line-clamp-3 text-sm whitespace-pre-line">
              {post.content}
            </p>
          </Link>
        </div>

        {post.image_url && (
          <Link href={`/dashboard/forum/${post.id}`}>
            <div className="px-4">
              <img
                src={resolveImageUrl(post.image_url)}
                alt={post.title}
                className="w-full rounded-lg object-cover max-h-[400px]"
              />
            </div>
          </Link>
        )}

        {/* Actions */}
        <div className="flex items-center gap-1 p-4 pt-3 border-t mt-3">
          <Button
            variant="ghost"
            size="sm"
            className={liked ? "text-red-500" : ""}
            onClick={handleLike}
            disabled={loading === "like"}
          >
            <Heart className={`h-4 w-4 mr-1 ${liked ? "fill-current" : ""}`} />
            {likeCount > 0 && likeCount}
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link href={`/dashboard/forum/${post.id}`}>
              <MessageSquare className="h-4 w-4 mr-1" />
              {post.comment_count > 0 && post.comment_count}
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className={saved ? "text-primary" : ""}
            onClick={handleSave}
            disabled={loading === "save"}
          >
            <Bookmark className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
          </Button>
          {isOwner && (
            <Button
              variant="ghost"
              size="sm"
              className="text-destructive ml-auto"
              onClick={handleDelete}
              disabled={loading === "delete"}
            >
              {loading === "delete" ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4" />
              )}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function getTimeAgo(dateStr: string): string {
  const now = Date.now();
  const diff = now - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `${minutes}min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d`;
  return new Date(dateStr).toLocaleDateString("pt-BR");
}
