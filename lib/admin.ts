const ADMIN_EMAILS = ["vierabruno4@gmail.com"];

export function isAdminEmail(email: string | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
}
