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
    console.log(profile);
   
    return (
        <div className="p-8 w-full">
            <section id="profile-header">
                <div id="banner" className="w-full">
                    <Image src="/images/profile-banner.png" alt="Profile Banner" width={1200} height={300} className="w-full h-60 object-cover rounded-2xl" />
                </div>
                <div id="profile" className="flex flex-col items-center mt-6">
                    <Image src={profile?.avatar_url || "/images/avatar-placeholder.jpeg"} alt="Profile Avatar" width={150} height={150} className="w-36 h-36 rounded-full object-cover border-4 border-white -mt-20" />
                    <h1 className="text-2xl font-bold mt-4">{profile?.full_name || "Usuário"}</h1>
                    <p className="text-gray-600">{user?.email}</p>
                </div>
            </section>
            <div id="profile-accomplishments">
                
            </div>



        </div>
    );
}