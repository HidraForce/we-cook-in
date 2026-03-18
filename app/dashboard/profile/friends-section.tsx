"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronDown,
  ChevronUp,
  UserCheck,
  UserX,
  Clock,
  Users,
} from "lucide-react";
import { respondFriendRequest, removeFriend } from "../forum/actions";
import { resolveAvatarUrl } from "@/lib/image-url";
import Link from "next/link";

type Friend = {
  friendship_id: string;
  id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
};

type PendingRequest = {
  friendship_id: string;
  id: string;
  full_name: string;
  username: string;
  avatar_url: string | null;
};

type FriendPost = {
  id: string;
  title: string;
  category: string;
  created_at: string;
  profiles: { full_name: string; avatar_url: string | null };
};

export function FriendsSection({
  friends,
  pendingRequests,
  friendPosts,
}: {
  friends: Friend[];
  pendingRequests: PendingRequest[];
  friendPosts: FriendPost[];
}) {
  const [showFriends, setShowFriends] = useState(false);
  const [showPosts, setShowPosts] = useState(false);
  const [loading, setLoading] = useState<string | null>(null);

  async function handleRespond(id: string, accept: boolean) {
    setLoading(id);
    await respondFriendRequest(id, accept);
    setLoading(null);
  }

  async function handleRemove(id: string) {
    if (!confirm("Remover amigo?")) return;
    setLoading(id);
    await removeFriend(id);
    setLoading(null);
  }

  return (
    <div className="space-y-4">
      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <Card>
          <CardContent className="p-4 space-y-3">
            <h3 className="font-semibold flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Solicitações Pendentes ({pendingRequests.length})
            </h3>
            {pendingRequests.map((req) => (
              <div
                key={req.friendship_id}
                className="flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-full bg-muted overflow-hidden shrink-0">
                    <img
                      src={resolveAvatarUrl(req.avatar_url)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{req.full_name}</p>
                    <p className="text-xs text-muted-foreground">@{req.username}</p>
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button
                    size="sm"
                    variant="default"
                    disabled={loading === req.friendship_id}
                    onClick={() => handleRespond(req.friendship_id, true)}
                  >
                    <UserCheck className="h-3 w-3" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={loading === req.friendship_id}
                    onClick={() => handleRespond(req.friendship_id, false)}
                    className="text-destructive"
                  >
                    <UserX className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Friends List Dropdown */}
      <Card>
        <CardContent className="p-4">
          <button
            onClick={() => setShowFriends(!showFriends)}
            className="w-full flex items-center justify-between"
          >
            <h3 className="font-semibold flex items-center gap-2">
              <Users className="h-4 w-4" />
              Amigos ({friends.length})
            </h3>
            {showFriends ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          {showFriends && (
            <div className="mt-3 space-y-2">
              {friends.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Nenhum amigo ainda. Interaja no fórum para fazer amizades!
                </p>
              ) : (
                friends.map((friend) => (
                  <div
                    key={friend.friendship_id}
                    className="flex items-center justify-between gap-3 py-1"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-8 h-8 rounded-full bg-muted overflow-hidden shrink-0">
                        <img
                          src={resolveAvatarUrl(friend.avatar_url)}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{friend.full_name}</p>
                        <p className="text-xs text-muted-foreground">@{friend.username}</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-destructive shrink-0"
                      disabled={loading === friend.friendship_id}
                      onClick={() => handleRemove(friend.friendship_id)}
                    >
                      <UserX className="h-3 w-3" />
                    </Button>
                  </div>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Friends Recent Posts Dropdown */}
      <Card>
        <CardContent className="p-4">
          <button
            onClick={() => setShowPosts(!showPosts)}
            className="w-full flex items-center justify-between"
          >
            <h3 className="font-semibold flex items-center gap-2">
              Posts dos Amigos ({friendPosts.length})
            </h3>
            {showPosts ? (
              <ChevronUp className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            )}
          </button>

          {showPosts && (
            <div className="mt-3 space-y-2">
              {friendPosts.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Seus amigos ainda não publicaram nada.
                </p>
              ) : (
                friendPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/dashboard/forum/${post.id}`}
                    className="flex items-start gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-muted overflow-hidden shrink-0 mt-0.5">
                      <img
                        src={resolveAvatarUrl(post.profiles.avatar_url)}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium truncate">{post.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-xs text-muted-foreground">
                          {post.profiles.full_name}
                        </span>
                        <Badge variant="outline" className="text-[10px] px-1 py-0">
                          {post.category === "recipe" ? "Receita" : "Dica"}
                        </Badge>
                      </div>
                    </div>
                  </Link>
                ))
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
