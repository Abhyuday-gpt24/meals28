"use server";

import { createClient } from "@/lib/supabase/server";
import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { loginSchema, signupSchema } from "@/lib/validations/auth";
import { getAuthenticatedUser } from "@/lib/auth/getUser";

const ROLE_DASHBOARDS: Record<string, string> = {
  CUSTOMER: "/",
  ADMIN: "/admin",
  STAFF: "/kitchen",
  DRIVER: "/driver",
};

const ROLE_LOGIN_PAGES: Record<string, string> = {
  CUSTOMER: "/login",
  ADMIN: "/admin/login",
  STAFF: "/kitchen/login",
  DRIVER: "/driver/login",
};

const ROLE_LABELS: Record<string, string> = {
  CUSTOMER: "Customer",
  ADMIN: "Admin",
  STAFF: "Kitchen Staff",
  DRIVER: "Driver",
};

export async function login(formData: FormData) {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
  });

  if (!parsed.success) {
    return {
      error: "Invalid input",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email, password, role } = parsed.data;
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Verify the user has the correct role for this portal
  const dbUser = await prisma.user.findUnique({
    where: { email },
    select: { role: true },
  });

  if (!dbUser) {
    await supabase.auth.signOut();
    return { error: "Account not found. Please sign up first." };
  }

  if (dbUser.role !== role) {
    await supabase.auth.signOut();
    return {
      error: `This account is registered as ${ROLE_LABELS[dbUser.role]}. Please use the correct portal.`,
    };
  }

  revalidatePath("/");
  redirect(ROLE_DASHBOARDS[dbUser.role] ?? "/");
}

export async function signup(formData: FormData) {
  const parsed = signupSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
    role: formData.get("role"),
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    return {
      error: "Please fix the errors below",
      fieldErrors: parsed.error.flatten().fieldErrors,
    };
  }

  const { email, password, role, firstName, lastName, phone } = parsed.data;
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  if (!data.user) {
    return { error: "Signup failed. Please try again." };
  }

  try {
    await prisma.user.upsert({
      where: { id: data.user.id },
      update: { role, firstName, lastName, phone: phone || null },
      create: {
        id: data.user.id,
        email,
        role,
        firstName,
        lastName,
        phone: phone || null,
      },
    });
  } catch (e: unknown) {
    if (
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      (e as { code: string }).code === "P2002"
    ) {
      return { error: "An account with this email or phone already exists." };
    }
    throw e;
  }

  revalidatePath("/");
  redirect(ROLE_DASHBOARDS[role] ?? "/");
}

export async function logout() {
  // Get role before signing out so we can redirect to the correct login page
  const user = await getAuthenticatedUser();
  const loginPage = ROLE_LOGIN_PAGES[user?.role ?? "CUSTOMER"] ?? "/login";

  const supabase = await createClient();
  await supabase.auth.signOut();

  revalidatePath("/");
  redirect(loginPage);
}
