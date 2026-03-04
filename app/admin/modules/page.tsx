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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Pencil, Eye, EyeOff, Layers, Video } from "lucide-react";
import Link from "next/link";
import { getPlanStyle } from "@/lib/plans";
import { DeleteModuleButton } from "./delete-button";

export default async function AdminModules() {
  const supabase = await createClient();

  const [{ data: modules }, { count }, { data: plans }] = await Promise.all([
    supabase
      .from("modules")
      .select("*, categories(name), plans:min_plan_id(id, slug, name)")
      .order("sort_order", { ascending: true }),
    supabase.from("modules").select("*", { count: "exact", head: true }),
    supabase.from("plans").select("id, slug, name").order("sort_order"),
  ]);

  const lessonCounts = new Map<string, number>();
  if (modules) {
    const { data: counts } = await supabase
      .from("lessons")
      .select("module_id");
    if (counts) {
      for (const row of counts) {
        lessonCounts.set(row.module_id, (lessonCounts.get(row.module_id) ?? 0) + 1);
      }
    }
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Módulos</h1>
          <p className="text-muted-foreground mt-1">
            {count ?? 0} módulos cadastrados
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/modules/new">
            <Plus className="mr-2 h-4 w-4" />
            Novo Módulo
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="h-5 w-5" />
            Todos os Módulos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {modules && modules.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-center">Plano</TableHead>
                  <TableHead className="text-center">Aulas</TableHead>
                  <TableHead className="text-center">Ordem</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {modules.map((mod) => {
                  const cat = mod.categories as { name: string } | null;
                  const plan = mod.plans as { id: string; slug: string; name: string } | null;
                  const numLessons = lessonCounts.get(mod.id) ?? 0;

                  return (
                    <TableRow key={mod.id}>
                      <TableCell className="font-medium">
                        {mod.name}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {cat?.name ?? "—"}
                      </TableCell>
                      <TableCell className="text-center">
                        {plan ? (
                          <Badge
                            variant="outline"
                            className={getPlanStyle(plan.slug)}
                          >
                            {plan.name}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="inline-flex items-center gap-1 text-muted-foreground">
                          <Video className="h-3 w-3" />
                          {numLessons}
                        </span>
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground">
                        {mod.sort_order}
                      </TableCell>
                      <TableCell className="text-center">
                        {mod.published ? (
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
                        <div className="flex items-center justify-end gap-2">
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/modules/${mod.id}`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <DeleteModuleButton id={mod.id} name={mod.name} />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Layers className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground mb-4">
                Nenhum módulo cadastrado ainda.
              </p>
              <Button asChild>
                <Link href="/admin/modules/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeiro Módulo
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
