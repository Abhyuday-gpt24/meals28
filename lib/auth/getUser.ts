import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import type { User } from "@/generated/prisma/client";

/** Returns the authenticated Prisma user, or null. For server components. */
export async function getAuthenticatedUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
  });

  return dbUser;
}

/** Returns the authenticated Prisma user, or throws. For server actions. */
export async function requireUser(): Promise<User> {
  const user = await getAuthenticatedUser();
  if (!user) throw new Error("Unauthorized");
  return user;
}
