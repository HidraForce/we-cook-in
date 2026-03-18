"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { updateProfile, type ProfileFormState } from "./actions";
import { Camera, Loader2, Pencil, X, Check } from "lucide-react";
import { resolveAvatarUrl, resolveBannerUrl } from "@/lib/image-url";

type Profile = {
  id: string;
  full_name: string;
  username: string;
  birth: string | null;
  address: string | null;
  avatar_url: string | null;
  banner_url: string | null;
};

export function ProfileEditor({
  profile,
  email,
}: {
  profile: Profile;
  email: string;
}) {
  const [editing, setEditing] = useState(false);
  const [state, formAction, isPending] = useActionState<ProfileFormState, FormData>(
    updateProfile,
    {}
  );
  const [avatarUrl, setAvatarUrl] = useState(resolveAvatarUrl(profile.avatar_url));
  const [bannerUrl, setBannerUrl] = useState(resolveBannerUrl(profile.banner_url));
  const [uploading, setUploading] = useState<"avatar" | "banner" | null>(null);
  const avatarInput = useRef<HTMLInputElement>(null);
  const bannerInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (state.success) setEditing(false);
  }, [state.success]);

  async function handleImageUpload(
    file: File,
    folder: string,
    setter: (url: string) => void,
    type: "avatar" | "banner"
  ) {
    setUploading(type);
    try {
      const fd = new FormData();
      fd.append("file", file);
      fd.append("folder", folder);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const data = await res.json();
      if (data.url) setter(data.url);
      else alert(data.error || "Erro ao fazer upload");
    } catch {
      alert("Erro ao fazer upload da imagem");
    }
    setUploading(null);
  }

  if (!editing) {
    return (
      <div className="space-y-6">
        {/* Banner */}
        <div className="relative w-full h-48 md:h-60 rounded-2xl overflow-hidden bg-muted">
          <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
        </div>

        {/* Avatar + Info */}
        <div className="flex flex-col items-center -mt-20 relative z-10">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background bg-muted">
            <img src={avatarUrl} alt={profile.full_name} className="w-full h-full object-cover" />
          </div>
          <h1 className="text-2xl font-bold mt-3">{profile.full_name}</h1>
          <p className="text-muted-foreground">@{profile.username}</p>
          <p className="text-sm text-muted-foreground">{email}</p>
          <Button
            variant="outline"
            size="sm"
            className="mt-3"
            onClick={() => setEditing(true)}
          >
            <Pencil className="mr-2 h-4 w-4" />
            Editar Perfil
          </Button>
        </div>

        {/* Info Cards */}
        {(profile.birth || profile.address) && (
          <div className="grid gap-4 sm:grid-cols-2 max-w-lg mx-auto">
            {profile.birth && (
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Nascimento</p>
                  <p className="font-medium">
                    {new Date(profile.birth + "T12:00:00").toLocaleDateString("pt-BR")}
                  </p>
                </CardContent>
              </Card>
            )}
            {profile.address && (
              <Card>
                <CardContent className="p-4">
                  <p className="text-xs text-muted-foreground">Endereço</p>
                  <p className="font-medium">{profile.address}</p>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Editable Banner */}
      <div className="relative w-full h-48 md:h-60 rounded-2xl overflow-hidden bg-muted group">
        <img src={bannerUrl} alt="Banner" className="w-full h-full object-cover" />
        <button
          type="button"
          onClick={() => bannerInput.current?.click()}
          disabled={uploading === "banner"}
          className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
        >
          {uploading === "banner" ? (
            <Loader2 className="h-8 w-8 text-white animate-spin" />
          ) : (
            <Camera className="h-8 w-8 text-white" />
          )}
        </button>
        <input
          ref={bannerInput}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleImageUpload(f, "banners", setBannerUrl, "banner");
          }}
        />
      </div>

      {/* Editable Avatar */}
      <div className="flex flex-col items-center -mt-20 relative z-10">
        <div className="relative group">
          <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-background bg-muted">
            <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
          </div>
          <button
            type="button"
            onClick={() => avatarInput.current?.click()}
            disabled={uploading === "avatar"}
            className="absolute inset-0 rounded-full flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
          >
            {uploading === "avatar" ? (
              <Loader2 className="h-6 w-6 text-white animate-spin" />
            ) : (
              <Camera className="h-6 w-6 text-white" />
            )}
          </button>
          <input
            ref={avatarInput}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) handleImageUpload(f, "avatars", setAvatarUrl, "avatar");
            }}
          />
        </div>
      </div>

      {/* Edit Form */}
      <form action={formAction} className="max-w-lg mx-auto space-y-4">
        <input type="hidden" name="avatar_url" value={avatarUrl} />
        <input type="hidden" name="banner_url" value={bannerUrl} />

        {state.error && (
          <div className="bg-destructive/10 text-destructive px-4 py-3 rounded-lg text-sm">
            {state.error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="full_name">Nome completo *</Label>
          <Input id="full_name" name="full_name" defaultValue={profile.full_name} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Usuário *</Label>
          <Input id="username" name="username" defaultValue={profile.username} required />
        </div>

        <div className="grid gap-4 grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="birth">Nascimento</Label>
            <Input id="birth" name="birth" type="date" defaultValue={profile.birth ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="address">Endereço</Label>
            <Input id="address" name="address" defaultValue={profile.address ?? ""} />
          </div>
        </div>

        <div className="flex gap-2">
          <Button type="submit" disabled={isPending} className="flex-1">
            {isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Check className="mr-2 h-4 w-4" />
            )}
            Salvar
          </Button>
          <Button type="button" variant="outline" onClick={() => setEditing(false)}>
            <X className="mr-2 h-4 w-4" />
            Cancelar
          </Button>
        </div>
      </form>
    </div>
  );
}
