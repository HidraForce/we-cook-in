"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { deleteCategory } from "./actions";
import { useState } from "react";

export function DeleteCategoryButton({ id, name }: { id: string; name: string }) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleDelete() {
    if (!confirm(`Tem certeza que deseja excluir "${name}"?`)) return;
    setPending(true);
    setError(null);
    const result = await deleteCategory(id);
    if (result.error) setError(result.error);
    setPending(false);
  }

  return (
    <div className="inline-flex items-center gap-2">
      <Button
        variant="ghost"
        size="sm"
        onClick={handleDelete}
        disabled={pending}
        className="text-destructive hover:text-destructive"
      >
        {pending ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Trash2 className="h-4 w-4" />
        )}
      </Button>
      {error && (
        <span className="text-xs text-destructive max-w-[200px]">{error}</span>
      )}
    </div>
  );
}
