import { createClient } from "@/utils/supabase/server";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { isAdminEmail } from "@/lib/admin";
import { resolveAvatarUrl } from "@/lib/image-url";

function getInitials(name: string | null): string {
  if (!name) return "?";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default async function AdminUsers() {
  const supabase = await createClient();

  const { data: profiles, count } = await supabase
    .from("profiles")
    .select("*", { count: "exact" })
    .order("created_at", { ascending: false });

  const {
    data: { users: authUsers },
  } = await supabase.auth.admin.listUsers();

  const emailMap = new Map(
    authUsers?.map((u) => [u.id, u.email]) ?? []
  );

  return (
    <div className="p-8 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Usuários</h1>
          <p className="text-muted-foreground mt-1">
            {count ?? 0} usuários cadastrados
          </p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Todos os Usuários</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12"></TableHead>
                <TableHead>Nome</TableHead>
                <TableHead>Username</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Cadastro</TableHead>
                <TableHead>Papel</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profiles && profiles.length > 0 ? (
                profiles.map((profile) => {
                  const email = emailMap.get(profile.id);
                  return (
                    <TableRow key={profile.id}>
                      <TableCell>
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={resolveAvatarUrl(profile.avatar_url)}
                            alt={profile.full_name}
                          />
                          <AvatarFallback className="text-xs">
                            {getInitials(profile.full_name)}
                          </AvatarFallback>
                        </Avatar>
                      </TableCell>
                      <TableCell className="font-medium">
                        {profile.full_name || "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {profile.username ? `@${profile.username}` : "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {email || "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {profile.address || "—"}
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {profile.created_at
                          ? new Date(profile.created_at).toLocaleDateString(
                              "pt-BR"
                            )
                          : "—"}
                      </TableCell>
                      <TableCell>
                        {isAdminEmail(email) ? (
                          <Badge variant="default">Admin</Badge>
                        ) : (
                          <Badge variant="secondary">Aluno</Badge>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    <p className="text-muted-foreground">
                      Nenhum usuário encontrado.
                    </p>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
