import { createClient } from "@/utils/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const token_hash = searchParams.get("token_hash");
  const type = searchParams.get("type");

  const supabase = await createClient();

  if (code) {
    await supabase.auth.exchangeCodeForSession(code);
  } else if (token_hash && type) {
    // Handles email confirmation / recovery links depending on template configuration.
    // Supabase expects specific "type" values; we pass through and rely on server-side validation.
    await supabase.auth.verifyOtp({ token_hash, type: type as any });
  }

  return NextResponse.redirect(new URL("/onboarding", request.url));
}