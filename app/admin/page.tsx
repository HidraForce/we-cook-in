import { createClient } from "@/utils/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, UserCheck, CalendarDays, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  const supabase = await createClient();

  const { count: totalUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true });

  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const { count: recentUsers } = await supabase
    .from("profiles")
    .select("*", { count: "exact", head: true })
    .gte("created_at", sevenDaysAgo.toISOString());

  const { data: latestUsers } = await supabase
    .from("profiles")
    .select("id, full_name, username, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  const stats = [
    {
      title: "Total de Usuários",
      value: totalUsers ?? 0,
      icon: Users,
      description: "Usuários cadastrados",
    },
    {
      title: "Novos (7 dias)",
      value: recentUsers ?? 0,
      icon: TrendingUp,
      description: "Cadastros recentes",
    },
    {
      title: "Com Perfil Completo",
      value: totalUsers ?? 0,
      icon: UserCheck,
      description: "Perfis preenchidos",
    },
    {
      title: "Hoje",
      value: new Date().toLocaleDateString("pt-BR", {
        weekday: "long",
        day: "numeric",
        month: "long",
      }),
      icon: CalendarDays,
      description: "Data atual",
    },
  ];

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Painel Administrativo</h1>
        <p className="text-muted-foreground mt-1">
          Visão geral da plataforma We Cook In
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Últimos Cadastros</CardTitle>
          <Link
            href="/admin/users"
            className="text-sm text-primary hover:underline"
          >
            Ver todos
          </Link>
        </CardHeader>
        <CardContent>
          {latestUsers && latestUsers.length > 0 ? (
            <div className="space-y-4">
              {latestUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center justify-between border-b pb-3 last:border-0 last:pb-0"
                >
                  <div>
                    <p className="font-medium">
                      {user.full_name || "Sem nome"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      @{user.username || "—"}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {user.created_at
                      ? new Date(user.created_at).toLocaleDateString("pt-BR")
                      : "—"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-sm">
              Nenhum usuário cadastrado ainda.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
