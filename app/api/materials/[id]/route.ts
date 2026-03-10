import { createAdminClient } from "@/utils/supabase/admin";
import { NextRequest, NextResponse } from "next/server";

const BUCKET = "lessons content";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: material, error } = await supabase
    .from("materials")
    .select("file_url, file_name")
    .eq("id", id)
    .single();

  if (error || !material?.file_url) {
    return NextResponse.json({ error: "Material não encontrado" }, { status: 404 });
  }

  const bucketSegment = encodeURIComponent(BUCKET);
  const parts = material.file_url.split(`/object/public/${bucketSegment}/`);
  if (parts.length < 2) {
    return NextResponse.json({ error: "URL inválida" }, { status: 400 });
  }
  const storagePath = decodeURIComponent(parts[1]);

  const { data, error: downloadError } = await supabase.storage
    .from(BUCKET)
    .download(storagePath);

  if (downloadError || !data) {
    return NextResponse.json({ error: "Erro ao baixar arquivo" }, { status: 500 });
  }

  const arrayBuffer = await data.arrayBuffer();
  const isDownload = request.nextUrl.searchParams.get("download") === "1";

  return new NextResponse(arrayBuffer, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `${isDownload ? "attachment" : "inline"}; filename="${material.file_name}"`,
      "Cache-Control": "private, max-age=3600",
    },
  });
}
