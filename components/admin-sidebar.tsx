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
} from "@/components/ui/sidebar";
import { LayoutDashboard, Users, BookOpen, Video, Layers, FolderOpen, ArrowLeft, Settings } from "lucide-react";
import Link from "next/link";

const mainItems = [
  { title: "Painel", url: "/admin", icon: LayoutDashboard },
  { title: "Usuários", url: "/admin/users", icon: Users },
];

const contentItems = [
  { title: "Categorias", url: "/admin/categories", icon: FolderOpen },
  { title: "Módulos", url: "/admin/modules", icon: Layers },
  { title: "Aulas", url: "/admin/lessons", icon: Video },
  { title: "Ebook", url: "/admin/ebook", icon: BookOpen },
];

const settingsItems = [
  { title: "Configurações", url: "/admin/settings", icon: Settings },
];

export function AdminSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between px-2">
          <span className="font-bold text-lg">Admin</span>
          <Link
            href="/dashboard"
            className="flex items-center gap-1 text-xs text-sidebar-foreground/70 hover:text-sidebar-foreground transition-colors"
          >
            <ArrowLeft className="w-3 h-3" />
            Voltar
          </Link>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Geral</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainItems.map((item) => (
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
          <SidebarGroupLabel>Conteúdo</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {contentItems.map((item) => (
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
          <SidebarGroupLabel>Sistema</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {settingsItems.map((item) => (
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
        <span className="text-xs text-muted-foreground px-2">Painel Administrativo</span>
      </SidebarFooter>
    </Sidebar>
  );
}
