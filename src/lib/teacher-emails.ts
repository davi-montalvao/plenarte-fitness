import type { Role } from "@prisma/client";

export function isTeacherEmail(email: string) {
  const allowList = (process.env.TEACHER_EMAILS ?? "")
    .split(",")
    .map((value) => value.trim().toLowerCase())
    .filter(Boolean);

  return allowList.includes(email.toLowerCase());
}

export function resolveRole(email: string): Role {
  return isTeacherEmail(email) ? "TEACHER" : "STUDENT";
}
