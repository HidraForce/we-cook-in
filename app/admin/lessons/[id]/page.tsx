import { createClient } from "@/utils/supabase/server";
import { LessonForm } from "../lesson-form";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditLesson({ params }: Props) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: lesson } = await supabase
    .from("lessons")
    .select("*")
    .eq("id", id)
    .single();

  if (!lesson) notFound();

  const [{ data: categories }, { data: modules }, { data: plans }] =
    await Promise.all([
      supabase.from("categories").select("id, name").order("sort_order"),
      supabase
        .from("modules")
        .select("id, name, category_id, min_plan_id")
        .order("sort_order"),
      supabase.from("plans").select("id, slug, name").order("sort_order"),
    ]);

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center gap-4">
        <Link
          href="/admin/lessons"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Link>
        <div>
          <h1 className="text-3xl font-bold">Editar Aula</h1>
          <p className="text-muted-foreground mt-1">{lesson.title}</p>
        </div>
      </div>

      <LessonForm
        modules={modules ?? []}
        categories={categories ?? []}
        plans={plans ?? []}
        lesson={lesson}
      />
    </div>
  );
}
