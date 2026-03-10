import { createClient } from "@/utils/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Layers, Video, ArrowLeft, Clock } from "lucide-react";
import { getPlanStyle } from "@/lib/plans";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function CategoryModules({
  params,
}: {
  params: Promise<{ categoryId: string }>;
}) {
  const { categoryId } = await params;
  const supabase = await createClient();

  const { data: category } = await supabase
    .from("categories")
    .select("*, plans(slug, name)")
    .eq("id", categoryId)
    .eq("published", true)
    .single();

  if (!category) notFound();

  const { data: modules } = await supabase
    .from("modules")
    .select("*, plans(slug, name), lessons(id, video_duration)")
    .eq("category_id", categoryId)
    .eq("published", true)
    .order("sort_order", { ascending: true });

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-start gap-4">
        <Button variant="outline" size="icon" asChild className="shrink-0 mt-1">
          <Link href="/dashboard/all">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">{category.name}</h1>
          {category.description && (
            <p className="text-muted-foreground mt-1">{category.description}</p>
          )}
        </div>
      </div>

      {modules && modules.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {modules.map((mod) => {
            const plan = mod.plans as { slug: string; name: string } | null;
            const lessonList = (mod.lessons as { id: string; video_duration: number | null }[]) ?? [];
            const lessonCount = lessonList.length;
            const totalMinutes = lessonList.reduce(
              (sum, l) => sum + (l.video_duration ?? 0),
              0
            );

            return (
              <Link
                key={mod.id}
                href={`/dashboard/all/${categoryId}/${mod.id}`}
              >
                <Card className="group overflow-hidden hover:shadow-md transition-all hover:border-primary/30 cursor-pointer h-full">
                  {mod.thumbnail_url ? (
                    <div className="aspect-video overflow-hidden bg-muted">
                      <img
                        src={mod.thumbnail_url}
                        alt={mod.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <Layers className="h-12 w-12 text-primary/30" />
                    </div>
                  )}
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg leading-tight">
                        {mod.name}
                      </h3>
                      {mod.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {mod.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-sm text-muted-foreground inline-flex items-center gap-1">
                        <Video className="h-3.5 w-3.5" />
                        {lessonCount} aula{lessonCount !== 1 && "s"}
                      </span>
                      {totalMinutes > 0 && (
                        <span className="text-sm text-muted-foreground inline-flex items-center gap-1">
                          <Clock className="h-3.5 w-3.5" />
                          {totalMinutes}min
                        </span>
                      )}
                      {plan && (
                        <Badge
                          variant="outline"
                          className={`text-xs ${getPlanStyle(plan.slug)}`}
                        >
                          {plan.name}
                        </Badge>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <Layers className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">
            Nenhum módulo disponível nesta categoria
          </h3>
        </div>
      )}
    </div>
  );
}
