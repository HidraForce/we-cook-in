import { createClient } from "@/utils/supabase/server";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { LessonViewer } from "./lesson-viewer";

export default async function ModuleLessons({
  params,
}: {
  params: Promise<{ categoryId: string; moduleId: string }>;
}) {
  const { categoryId, moduleId } = await params;
  const supabase = await createClient();

  const { data: mod } = await supabase
    .from("modules")
    .select("*, categories(name)")
    .eq("id", moduleId)
    .eq("published", true)
    .single();

  if (!mod) notFound();

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, title, description, video_url, video_duration, material_url, material_name, is_preview, sort_order")
    .eq("module_id", moduleId)
    .eq("published", true)
    .order("sort_order", { ascending: true });

  const categoryName = (mod.categories as { name: string } | null)?.name ?? "";

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start gap-4">
        <Button variant="outline" size="icon" asChild className="shrink-0 mt-1">
          <Link href={`/dashboard/all/${categoryId}`}>
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <p className="text-sm text-muted-foreground">{categoryName}</p>
          <h1 className="text-3xl font-bold">{mod.name}</h1>
          {mod.description && (
            <p className="text-muted-foreground mt-1">{mod.description}</p>
          )}
        </div>
      </div>

      <LessonViewer lessons={lessons ?? []} />
    </div>
  );
}
