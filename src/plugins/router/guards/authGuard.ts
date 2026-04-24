import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { useAppJwt } from "@/stores/application/jwt";
import type { AccessRole } from "@/plugins/router";

/**
 * Navigation guard for route access control based on user authentication and role.
 *
 * Route meta field: `access_roles?: AccessRole[]`
 *
 * Access rules
 * ────────────
 * "public"   → everyone (authenticated or not) can access to this route
 * "guest"    → only unauthenticated users (no token OR expired token)
 *              authenticated users are redirected to their /admin
 * "admin"    → valid, authorized with role === "admin" can access
 * "operator"    → valid, authorized with role === "operator" can access
 *
 * A route may combine roles, e.g. ["admin", "operator"] allows both.
 *
 * Redirects
 * ─────────
 * - Route not found                              → /log/404
 * - No whoCanAccessThisRoute defined                      → /log/forbidden  (deny by default)
 * - Authenticated user    → role home (/admin or /)
 * - Unauthenticated user hits a protected route  → /auth/login
 * - Authenticated but wrong role                 → /log/forbidden
 *
 * @param to   - Target route location
 * @param _from - Current route location (unused)
 * @param next - Navigation guard next function
 */
export const install = (
  to: RouteLocationNormalized,
  _from: RouteLocationNormalized,
  next: NavigationGuardNext,
): void => {
  // ── 1. Route existence check ──────────────────────────────────────────────
  if (to.matched.length === 0) {
    next({ name: "/log/404" });
    return;
  }

  // ── 2. Resolve current user state ─────────────────────────────────────────
  const jwt = useAppJwt();

  /**
   * A user is considered "authenticated" only when:
   *   - a payload exists (token was decoded successfully), AND
   *   - the token is NOT expired
   */
  const isAuthenticated = !!jwt.payload && !jwt.isExpired;

  /**
   * Effective role:
   *   - "guest"    → no token or expired token
   *   - "admin"    → valid token with role admin
   *   - "operator" → valid token with role operator
   */
  const userRole: AccessRole = isAuthenticated
    ? (jwt.role as AccessRole)
    : "guest";

  // ── 3. Read route meta ────────────────────────────────────────────────────
  const allowedRoles: AccessRole[] = to.meta.whoCanAccessThisRoute ?? [];

  // No access control defined → deny by default (security-first)
  if (allowedRoles.length === 0) {
    next({ name: "/log/forbidden" });
    return;
  }

  // ── 4. Public routes ──────────────────────────────────────────────────────
  // Everyone (authenticated or not) may access public routes.
  if (allowedRoles.includes("public")) {
    next();
    return;
  }

  // ── 5. Guest-only routes (login, register, …) ─────────────────────────────
  // A route is "guest-only" when it lists "guest" but no authenticated roles.
  const hasAuthenticatedRoles = allowedRoles.some(
    (r) => r === "admin" || r === "operator",
  );
  const isGuestOnlyRoute =
    allowedRoles.includes("guest") && !hasAuthenticatedRoles;

  if (isGuestOnlyRoute) {
    if (userRole === "guest") {
      // Unauthenticated user → allow
      next();
      return;
    }

    // Authenticated user tried to open a guest-only page → redirect to home
    if (userRole === "admin") {
      next({ name: "/dashboard/admin" });
      return;
    }

    // operator (or any other authenticated role)
    next({ name: "/" });
    return;
  }

  // ── 6. Protected routes (admin / operator) ────────────────────────────────
  // Unauthenticated users must log in first.
  if (userRole === "guest") {
    next({ name: "/auth/login" });
    return;
  }

  // Check whether the authenticated user's role is in the allowed list.
  if (allowedRoles.includes(userRole)) {
    next();
    return;
  }

  // Authenticated but wrong role → forbidden
  next({ name: "/log/forbidden" });
};

export default { install };
