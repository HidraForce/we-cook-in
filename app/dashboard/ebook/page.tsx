import { createClient } from "@/utils/supabase/server";
import { BookOpen } from "lucide-react";
import { EbookList } from "./ebook-list";

export default async function DashboardEbooks() {
  const supabase = await createClient();

  const { data: materials } = await supabase
    .from("materials")
    .select("id, title, description, file_url, file_name, thumbnail_url")
    .eq("published", true)
    .order("sort_order", { ascending: true });

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <BookOpen className="h-8 w-8" />
          Ebooks
        </h1>
        <p className="text-muted-foreground mt-1">
          Leia e baixe os materiais disponíveis para estudo.
        </p>
      </div>

      <EbookList ebooks={materials ?? []} />
    </div>
  );
}
