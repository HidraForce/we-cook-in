import { createClient } from "@/utils/supabase/server";
import { ModuleForm } from "../module-form";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default async function NewModule() {
  const supabase = await createClient();

  const [{ data: categories }, { data: plans }] = await Promise.all([
    supabase.from("categories").select("id, name").order("sort_order"),
    supabase.from("plans").select("id, slug, name").order("sort_order"),
  ]);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/modules"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Novo Módulo</h1>
          <p className="text-muted-foreground mt-1">
            Crie um módulo e atribua a um plano de acesso
          </p>
        </div>
      </div>

      <ModuleForm categories={categories ?? []} plans={plans ?? []} />
    </div>
  );
}
