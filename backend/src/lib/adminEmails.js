function parseAdminEmailSet() {
  const raw = process.env.ADMIN_EMAILS || "";
  return new Set(
    raw
      .split(",")
      .map((email) => email.trim().toLowerCase())
      .filter(Boolean)
  );
}

const adminEmailSet = parseAdminEmailSet();

export function isAdminEmail(email) {
  if (!email) return false;
  return adminEmailSet.has(String(email).trim().toLowerCase());
}

export function resolveRoleForEmail(email) {
  return isAdminEmail(email) ? "ADMIN" : "USER";
}
