import { createClient } from "@/utils/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FolderOpen, Layers } from "lucide-react";
import { getPlanStyle } from "@/lib/plans";
import Link from "next/link";

export default async function AllLessons() {
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*, plans(slug, name), modules(id)")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Todas as Aulas</h1>
        <p className="text-muted-foreground mt-1">
          Escolha uma categoria para começar.
        </p>
      </div>

      {categories && categories.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => {
            const plan = category.plans as { slug: string; name: string } | null;
            const moduleCount = (category.modules as { id: string }[])?.length ?? 0;

            return (
              <Link key={category.id} href={`/dashboard/all/${category.id}`}>
                <Card className="group overflow-hidden hover:shadow-md transition-all hover:border-primary/30 cursor-pointer h-full">
                  {category.thumbnail_url ? (
                    <div className="aspect-video overflow-hidden bg-muted">
                      <img
                        src={category.thumbnail_url}
                        alt={category.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="aspect-video bg-linear-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                      <FolderOpen className="h-12 w-12 text-primary/30" />
                    </div>
                  )}
                  <CardContent className="p-4 space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg leading-tight">
                        {category.name}
                      </h3>
                      {category.description && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {category.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground inline-flex items-center gap-1">
                        <Layers className="h-3.5 w-3.5" />
                        {moduleCount} módulo{moduleCount !== 1 && "s"}
                      </span>
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
          <FolderOpen className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">
            Nenhuma categoria disponível
          </h3>
          <p className="text-sm text-muted-foreground/70 mt-1">
            O conteúdo aparecerá aqui em breve.
          </p>
        </div>
      )}
    </div>
  );
}
