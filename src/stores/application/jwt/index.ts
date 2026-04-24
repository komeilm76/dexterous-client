import { defineStore } from "pinia";
import { useJWT } from "@/composables/jwt";
import { parse, stringify } from "zipson";

/**
 * Pinia store for JWT authentication state.
 *
 * Wraps `useJWT` as a singleton so that all components and stores
 * share the same token state. Use this store instead of calling
 * `useJWT()` directly to avoid creating isolated, diverging instances.
 *
 * @example
 * const jwt = useAppJwt();
 *
 * // Login
 * jwt.login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
 *
 * // Check role
 * if (jwt.role.value === 'admin') { ... }
 * if (jwt.isGuest.value) { ... }
 * if (jwt.isAdmin.value) { ... }
 *
 * // Logout
 * jwt.logout();
 */
export const useAppJwt = defineStore(
  "app_jwt",
  () => {
    const jwt = useJWT({ storageKey: "jwt_token" });

    return {
      // State
      token: jwt.token,
      payload: jwt.payload,

      // Computed
      role: jwt.role,
      isGuest: jwt.isGuest,
      isExpired: jwt.isExpired,
      expiresIn: jwt.expiresIn,
      isAdmin: jwt.isAdmin,
      isOperator: jwt.isOperator,
      subject: jwt.subject,
      authorizationHeader: jwt.authorizationHeader,

      // Methods
      login: jwt.login,
      logout: jwt.logout,
      setToken: jwt.setToken,
      clearToken: jwt.clearToken,
      hasRole: jwt.hasRole,
      getClaim: jwt.getClaim,
      decodeToken: jwt.decodeToken,
      initFromStorage: jwt.initFromStorage,
    };
  },
  {
    persist: {
      pick: ["token"],
      serializer: {
        deserialize: parse,
        serialize: stringify,
      },
    },
  }
);
