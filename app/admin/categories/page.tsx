import { createClient } from "@/utils/supabase/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Eye, EyeOff, FolderOpen, Layers } from "lucide-react";
import { getPlanStyle } from "@/lib/plans";
import { CategoryDialog } from "./category-dialog";
import { DeleteCategoryButton } from "./delete-button";

export default async function AdminCategories() {
  const supabase = await createClient();

  const [{ data: categories }, { data: plans }] = await Promise.all([
    supabase
      .from("categories")
      .select("*, plans:min_plan_id(id, slug, name)")
      .order("sort_order", { ascending: true }),
    supabase.from("plans").select("id, slug, name").order("sort_order"),
  ]);

  const moduleCounts = new Map<string, number>();
  if (categories) {
    const { data: modules } = await supabase
      .from("modules")
      .select("category_id");
    if (modules) {
      for (const row of modules) {
        moduleCounts.set(
          row.category_id,
          (moduleCounts.get(row.category_id) ?? 0) + 1
        );
      }
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Categorias</h1>
          <p className="text-muted-foreground mt-1">
            Organize seus módulos em categorias
          </p>
        </div>
        <CategoryDialog plans={plans ?? []} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Todas as Categorias
          </CardTitle>
        </CardHeader>
        <CardContent>
          {categories && categories.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead className="text-center">Plano</TableHead>
                  <TableHead className="text-center">Módulos</TableHead>
                  <TableHead className="text-center">Ordem</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {categories.map((cat) => {
                  const plan = cat.plans as { id: string; slug: string; name: string } | null;
                  return (
                    <TableRow key={cat.id}>
                      <TableCell className="font-medium">{cat.name}</TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">
                        {cat.description || "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        {plan ? (
                          <Badge variant="outline" className={getPlanStyle(plan.slug)}>
                            {plan.name}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <Layers className="h-3 w-3" />
                          {moduleCounts.get(cat.id) ?? 0}
                        </span>
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground">
                        {cat.sort_order}
                      </TableCell>
                      <TableCell className="text-center">
                        {cat.published ? (
                          <Badge variant="default" className="gap-1">
                            <Eye className="h-3 w-3" />
                            Publicado
                          </Badge>
                        ) : (
                          <Badge variant="secondary" className="gap-1">
                            <EyeOff className="h-3 w-3" />
                            Rascunho
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end gap-1">
                          <CategoryDialog plans={plans ?? []} category={cat} />
                          <DeleteCategoryButton id={cat.id} name={cat.name} />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <FolderOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground mb-2">
                Nenhuma categoria cadastrada.
              </p>
              <p className="text-sm text-muted-foreground mb-4">
                Crie categorias para organizar seus módulos e aulas.
              </p>
              <CategoryDialog plans={plans ?? []} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
