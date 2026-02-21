import type { NavigationGuardNext, RouteLocationNormalized } from "vue-router";
import { useAppSetting } from "@/stores/application/setting";

/**
 * Type definitions for route access control
 */
type IRole = "admin" | "operator" | "guest" | "public";

type IMeta = {
  whoCanAccessThisRoute?: IRole[];
};

/**
 * Navigation guard for route access control based on user authentication and role
 *
 * Access rules:
 * - 'admin': User must have valid auth token with role 'admin'
 * - 'operator': User must have valid auth token with role 'operator'
 * - 'guest': User must NOT have auth token (unauthenticated users only)
 * - 'public': Anyone can access (authenticated or not)
 *
 * Redirects:
 * - If access is forbidden → '/log/forbidden'
 * - If route doesn't exist → '/log/404'
 *
 * @param to - Target route location
 * @param from - Current route location
 * @param next - Navigation guard next function
 */
export const install = (
  to: RouteLocationNormalized,
  from: RouteLocationNormalized,
  next: NavigationGuardNext,
): void => {
  console.log("to", to);
  console.log("from", from);

  // Get authentication token and parse it
  const appSetting = useAppSetting();
  const parsedToken = appSetting.getParsedToken();
  console.log("parsedToken", parsedToken);

  // Determine if user is authenticated
  const isAuthenticated = parsedToken !== null && parsedToken !== undefined;

  // Extract user role from token (undefined if not authenticated)
  const userRole: "admin" | "operator" | undefined = parsedToken?.role;
  console.log("userRole", userRole);

  // Get allowed roles from route meta
  const meta = to.meta as IMeta;
  console.log("meta", meta.whoCanAccessThisRoute);

  const allowedRoles: IRole[] = meta.whoCanAccessThisRoute || [];
  console.log("allowedRoles", allowedRoles);

  if (to.matched.length == 0) {
    next({ name: "/log/404" });
  }

  // If no access control is defined, deny access by default for security
  if (allowedRoles.length === 0) {
    next({ name: "/log/forbidden" });
    return;
  }

  // Check if route allows public access
  const isPublicRoute = allowedRoles.includes("public");
  console.log("isPublicRoute", isPublicRoute);

  if (isPublicRoute) {
    next();
    return;
  }

  // Check if route is for guests only (unauthenticated users)
  const isGuestOnlyRoute = allowedRoles.includes("guest");
  if (isGuestOnlyRoute) {
    if (!isAuthenticated) {
      // User is not authenticated, allow access
      next();
      return;
    } else {
      // User is authenticated but trying to access guest-only route
      // Redirect to forbidden page
      next({ name: "/log/forbidden" });
      return;
    }
  }

  // Check if route requires authentication (admin or operator)
  const requiresAdmin = allowedRoles.includes("admin");
  const requiresOperator = allowedRoles.includes("operator");

  // If route requires authentication, check if user is authenticated
  if (!isAuthenticated) {
    // User is not authenticated but trying to access protected route
    next({ name: "/log/forbidden" });
    return;
  }

  // User is authenticated, check role-based access
  if (requiresAdmin && userRole === "admin") {
    // User is admin and route allows admin access
    next();
    return;
  }

  if (requiresOperator && userRole === "operator") {
    // User is operator and route allows operator access
    next();
    return;
  }

  // If user role doesn't match any allowed role, deny access
  next({ name: "/log/forbidden" });
};

export default { install };
