import { createClient } from "@/utils/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Video, BookOpen, FolderOpen, Layers } from "lucide-react";
import Link from "next/link";

export default async function Dashboard() {
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();

  const { data: profile } = user
    ? await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single()
    : { data: null };

  const [{ count: categoryCount }, { count: moduleCount }, { count: lessonCount }, { count: ebookCount }] =
    await Promise.all([
      supabase.from("categories").select("*", { count: "exact", head: true }).eq("published", true),
      supabase.from("modules").select("*", { count: "exact", head: true }).eq("published", true),
      supabase.from("lessons").select("*", { count: "exact", head: true }).eq("published", true),
      supabase.from("materials").select("*", { count: "exact", head: true }).eq("published", true),
    ]);

  const firstName = profile?.full_name?.split(" ")[0] ?? "Chef";

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Olá, {firstName}!</h1>
        <p className="text-muted-foreground mt-1">
          Bem-vindo de volta. Continue aprendendo!
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10">
              <FolderOpen className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{categoryCount ?? 0}</p>
              <p className="text-sm text-muted-foreground">Categorias</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-amber-100">
              <Layers className="h-6 w-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{moduleCount ?? 0}</p>
              <p className="text-sm text-muted-foreground">Módulos</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-blue-100">
              <Video className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{lessonCount ?? 0}</p>
              <p className="text-sm text-muted-foreground">Aulas</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-4 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-md bg-red-100">
              <BookOpen className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-semibold">{ebookCount ?? 0}</p>
              <p className="text-sm text-muted-foreground">Materiais</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-primary/10">
                <Video className="h-5 w-5 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Aulas</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Navegue pelas categorias e módulos para assistir as aulas.
            </p>
            <Button asChild>
              <Link href="/dashboard/all">Ver Todas as Aulas</Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardContent className="p-6 space-y-3">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-md bg-red-100">
                <BookOpen className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="font-semibold text-lg">Ebooks & Materiais</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Leia e baixe os materiais complementares.
            </p>
            <Button variant="outline" asChild>
              <Link href="/dashboard/ebook">Ver Materiais</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
