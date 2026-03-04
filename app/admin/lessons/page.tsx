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
import { Plus, Pencil, Eye, EyeOff, Clock, Video, FileText } from "lucide-react";
import Link from "next/link";
import { getPlanStyle } from "@/lib/plans";
import { DeleteLessonButton } from "./delete-button";

export default async function AdminLessons() {
  const supabase = await createClient();

  const [{ data: lessons }, { count }, { data: plans }] = await Promise.all([
    supabase
      .from("lessons")
      .select("*, modules(name, min_plan_id, categories(name))")
      .order("sort_order", { ascending: true }),
    supabase.from("lessons").select("*", { count: "exact", head: true }),
    supabase.from("plans").select("id, slug, name").order("sort_order"),
  ]);

  const planMap = new Map((plans ?? []).map((p) => [p.id, p]));

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Aulas</h1>
          <p className="text-muted-foreground mt-1">
            {count ?? 0} aulas cadastradas
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/lessons/new">
            <Plus className="mr-2 h-4 w-4" />
            Nova Aula
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Video className="h-5 w-5" />
            Todas as Aulas
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lessons && lessons.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Módulo</TableHead>
                  <TableHead>Categoria</TableHead>
                  <TableHead className="text-center">Plano</TableHead>
                  <TableHead className="text-center">Duração</TableHead>
                  <TableHead className="text-center">Ordem</TableHead>
                  <TableHead className="text-center">PDF</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lessons.map((lesson) => {
                  const mod = lesson.modules as {
                    name: string;
                    min_plan_id: string | null;
                    categories: { name: string };
                  } | null;
                  const plan = mod?.min_plan_id
                    ? planMap.get(mod.min_plan_id)
                    : null;
                  return (
                    <TableRow key={lesson.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {lesson.title}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {mod?.name ?? "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {mod?.categories?.name ?? "—"}
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
                      <TableCell className="text-center text-muted-foreground">
                        {lesson.video_duration ? (
                          <span className="inline-flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {lesson.video_duration}min
                          </span>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground">
                        {lesson.sort_order}
                      </TableCell>
                      <TableCell className="text-center">
                        {lesson.material_url ? (
                          <a
                            href={lesson.material_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={lesson.material_name ?? "PDF"}
                          >
                            <FileText className="h-4 w-4 text-red-500 mx-auto" />
                          </a>
                        ) : (
                          <span className="text-muted-foreground text-sm">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        {lesson.published ? (
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
                            <Link href={`/admin/lessons/${lesson.id}`}>
                              <Pencil className="h-4 w-4" />
                            </Link>
                          </Button>
                          <DeleteLessonButton id={lesson.id} title={lesson.title} />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Video className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground mb-4">
                Nenhuma aula cadastrada ainda.
              </p>
              <Button asChild>
                <Link href="/admin/lessons/new">
                  <Plus className="mr-2 h-4 w-4" />
                  Criar Primeira Aula
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
