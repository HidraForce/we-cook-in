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
import { BookOpen, Eye, EyeOff, FileText, Download, Video } from "lucide-react";
import { EbookDialog } from "./ebook-dialog";
import { DeleteEbookButton } from "./delete-button";

export default async function AdminEbooks() {
  const supabase = await createClient();

  const [{ data: materials }, { count }, { data: lessons }] = await Promise.all([
    supabase
      .from("materials")
      .select("*, lessons(title)")
      .order("sort_order", { ascending: true }),
    supabase.from("materials").select("*", { count: "exact", head: true }),
    supabase
      .from("lessons")
      .select("id, title")
      .order("title", { ascending: true }),
  ]);

  const lessonList = (lessons ?? []).map((l) => ({ id: l.id, title: l.title }));

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Materiais / Ebooks</h1>
          <p className="text-muted-foreground mt-1">
            {count ?? 0} materiais cadastrados
          </p>
        </div>
        <EbookDialog lessons={lessonList} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Todos os Materiais
          </CardTitle>
        </CardHeader>
        <CardContent>
          {materials && materials.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Título</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Aula vinculada</TableHead>
                  <TableHead className="text-center">Arquivo</TableHead>
                  <TableHead className="text-center">Ordem</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-right">Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.map((material) => {
                  const linkedLesson = material.lessons as { title: string } | null;
                  return (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium max-w-[200px] truncate">
                        {material.title}
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-[200px] truncate">
                        {material.description ?? "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground max-w-[180px] truncate">
                        {linkedLesson ? (
                          <span className="inline-flex items-center gap-1">
                            <Video className="h-3 w-3 shrink-0" />
                            {linkedLesson.title}
                          </span>
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <div className="flex items-center justify-center gap-2">
                          <a
                            href={`/api/materials/${material.id}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            title={material.file_name}
                          >
                            <FileText className="h-4 w-4 text-red-500" />
                          </a>
                          <a
                            href={`/api/materials/${material.id}?download=1`}
                            title="Download"
                          >
                            <Download className="h-4 w-4 text-muted-foreground hover:text-foreground transition-colors" />
                          </a>
                        </div>
                      </TableCell>
                      <TableCell className="text-center text-muted-foreground">
                        {material.sort_order}
                      </TableCell>
                      <TableCell className="text-center">
                        {material.published ? (
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
                          <EbookDialog ebook={material} lessons={lessonList} />
                          <DeleteEbookButton id={material.id} title={material.title} />
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BookOpen className="h-12 w-12 text-muted-foreground/50 mb-4" />
              <p className="text-muted-foreground mb-4">
                Nenhum material cadastrado ainda.
              </p>
              <EbookDialog lessons={lessonList} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
