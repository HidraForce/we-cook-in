"use client";

import { Button } from "@/components/ui/button";
import { Trash2, Loader2 } from "lucide-react";
import { deleteModule } from "./actions";
import { useState } from "react";

export function DeleteModuleButton({ id, name }: { id: string; name: string }) {
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!confirm(`Tem certeza que deseja excluir o módulo "${name}"? Todas as aulas deste módulo também serão afetadas.`)) return;
    setPending(true);
    await deleteModule(id);
    setPending(false);
  }

  return (
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
  );
}
