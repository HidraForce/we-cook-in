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
import { Book, Home, Settings, Users, Video, Wallet } from "lucide-react"

const items = [
  { title: "Bem vindo", url: "/dashboard", icon: Home },
  { title: "Todas as aulas", url: "/dashboard/all", icon: Video },
  { title: "Leia o ebook", url: "/dashboard/ebook", icon: Book },
]
const Profile = [
  { title: "Meu perfil", url: "/dashboard/profile", icon: Users },
  { title: "Pagamentos", url: "/dashboard/payments", icon: Wallet },
  { title: "Configurações", url: "/dashboard/settings", icon: Settings },
]


export function AppSidebar() {
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
              {Profile.map((item) => (
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
      </SidebarContent>

      <SidebarFooter>
        <span className="text-xs text-muted-foreground px-2">v1.0.0</span>
      </SidebarFooter>
    </Sidebar>
  )
}