import Image from "next/image";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function Profile() {
    const supabase = await createClient();
    
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect("/login");

    const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

    return (
        <main className="p-8">
            <h1 className="text-3xl font-bold mb-4">Meu Perfil</h1>
            <p className="text-gray-700">Aqui você pode atualizar suas informações pessoais, gerenciar suas preferências e acessar suas configurações de conta.</p>
            <div id="card" className="bg-white rounded-2xl shadow-lg p-8 w-full max-w-sm mt-6">
                <div id="avatar">
                    <Image 
                        src={profile?.avatar_url || "/images/avatar-placeholder.jpeg"} 
                        alt="Avatar" 
                        width={100} 
                        height={100} 
                        className="rounded-full mb-4" 
                    />
                </div>
                <div id="info">
                    <h2 className="text-2xl font-semibold mb-2">{profile?.full_name || "No name set"}</h2>
                    <p className="text-gray-600 mb-1">@{profile?.username || "no username"}</p>
                    <p className="text-gray-600 mb-1">{user.email}</p>
                    <p className="text-gray-600 mb-4">{profile?.address || "No address set"}</p>
                </div>
            </div>
        </main>
    );
}