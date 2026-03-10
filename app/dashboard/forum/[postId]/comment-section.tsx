"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Send, Trash2 } from "lucide-react";
import { createComment, deleteComment } from "../actions";
import { resolveImageUrl } from "@/lib/image-url";

type Comment = {
  id: string;
  content: string;
  created_at: string;
  user_id: string;
  profiles: { full_name: string; username: string; avatar_url: string | null };
};

export function CommentSection({
  postId,
  comments,
  currentUserId,
}: {
  postId: string;
  comments: Comment[];
  currentUserId: string;
}) {
  const [content, setContent] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    await createComment(postId, content);
    setContent("");
    setSubmitting(false);
  }

  async function handleDelete(commentId: string) {
    setDeleting(commentId);
    await deleteComment(commentId, postId);
    setDeleting(null);
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold">
        Comentários ({comments.length})
      </h3>

      {/* Comment Form */}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Escreva um comentário..."
          rows={2}
          className="flex-1 resize-none"
        />
        <Button
          type="submit"
          size="icon"
          disabled={submitting || !content.trim()}
          className="shrink-0 self-end"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>

      {/* Comments List */}
      <div className="space-y-3">
        {comments.map((comment) => {
          const isOwner = comment.user_id === currentUserId;

          return (
            <div
              key={comment.id}
              className="flex gap-3 p-3 rounded-lg bg-muted/30"
            >
              <div className="w-8 h-8 rounded-full bg-muted overflow-hidden shrink-0">
                {comment.profiles.avatar_url ? (
                  <img
                    src={resolveImageUrl(comment.profiles.avatar_url)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-xs font-bold text-muted-foreground">
                    {comment.profiles.full_name.charAt(0)}
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">
                    {comment.profiles.full_name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    @{comment.profiles.username}
                  </span>
                </div>
                <p className="text-sm mt-0.5 whitespace-pre-line">{comment.content}</p>
              </div>
              {isOwner && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-destructive shrink-0 self-start"
                  disabled={deleting === comment.id}
                  onClick={() => handleDelete(comment.id)}
                >
                  {deleting === comment.id ? (
                    <Loader2 className="h-3 w-3 animate-spin" />
                  ) : (
                    <Trash2 className="h-3 w-3" />
                  )}
                </Button>
              )}
            </div>
          );
        })}
        {comments.length === 0 && (
          <p className="text-sm text-muted-foreground text-center py-4">
            Nenhum comentário ainda. Seja o primeiro!
          </p>
        )}
      </div>
    </div>
  );
}
