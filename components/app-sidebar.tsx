import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Book, Home, MessageSquare, Settings, Shield, Users, Video, Wallet } from "lucide-react"
import { createClient } from "@/utils/supabase/server"
import { isAdminEmail } from "@/lib/admin"

const items = [
  { title: "Bem vindo", url: "/dashboard", icon: Home },
  { title: "Todas as aulas", url: "/dashboard/all", icon: Video },
  { title: "Leia o ebook", url: "/dashboard/ebook", icon: Book },
  { title: "Fórum", url: "/dashboard/forum", icon: MessageSquare },
]
const profileItems = [
  { title: "Meu perfil", url: "/dashboard/profile", icon: Users },
  { title: "Pagamentos", url: "/dashboard/payments", icon: Wallet },
  { title: "Configurações", url: "/dashboard/settings", icon: Settings },
]


export async function AppSidebar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const admin = isAdminEmail(user?.email)

  return (
    <Sidebar>
      <SidebarHeader>
        <span className="font-bold text-lg px-2">We Cook in!</span>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Conteudo</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Perfil</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {profileItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {admin && (
          <SidebarGroup>
            <SidebarGroupLabel>Administração</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                <SidebarMenuItem>
                  <SidebarMenuButton asChild>
                    <a href="/admin">
                      <Shield />
                      <span>Painel Admin</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>

      <SidebarFooter>
        <span className="text-xs text-muted-foreground px-2">v1.0.0</span>
      </SidebarFooter>
    </Sidebar>
  )
}