import { ref, computed } from "vue";

/**
 * JWT Payload type definition
 * Standard JWT claims with optional custom claims
 */
export type JwtPayload = {
  exp?: number;
  iat?: number;
  sub?: string;
  role?: "admin" | "operator";
  [key: string]: any;
};

/**
 * Options for useJWT composable
 */
export interface UseJwtOptions {
  /** Storage key for the JWT token */
  storageKey?: string;
  /** Token prefix (default: 'Bearer ') */
  tokenPrefix?: string;
}

/**
 * JWT Composable
 * Provides utilities for JWT token management including:
 * - Token parsing and decoding
 * - Expiration checking
 * - Payload extraction
 * - Role verification
 * - Token storage
 *
 * @example
 * const { token, payload, isExpired, isAdmin, login, logout } = useJWT();
 *
 * // Login with token
 * login('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...');
 *
 * // Check if user is admin
 * if (isAdmin.value) {
 *   console.log('User is admin');
 * }
 *
 * // Check if token is expired
 * if (isExpired.value) {
 *   console.log('Token expired, please login again');
 * }
 */
export const useJWT = (options: UseJwtOptions = {}) => {
  const { storageKey = "jwt_token", tokenPrefix = "Bearer " } = options;

  // Reactive token string
  const _token = ref<string>("");

  // Reactive parsed payload
  const _payload = ref<JwtPayload | null>(null);

  /**
   * Decodes a JWT token without verification
   * @param token - The JWT token string
   * @returns The decoded payload or null if invalid
   */
  const decodeToken = (token: string): JwtPayload | null => {
    if (!token) return null;

    try {
      const parts = token.split(".");
      if (parts.length !== 3) return null;

      const payload = parts[1];
      if (!payload) return null;

      // Decode base64url to base64, then decode as UTF-8 (Unicode-safe)
      const base64 = payload.replace(/-/g, "+").replace(/_/g, "/");
      const decoded = decodeURIComponent(
        atob(base64)
          .split("")
          .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join(""),
      );
      return JSON.parse(decoded);
    } catch {
      return null;
    }
  };

  /**
   * Check if token is expired
   * Compares expiration time with current time
   */
  const isExpired = computed(() => {
    if (!_payload.value) return true;

    const { exp } = _payload.value;
    if (!exp) return false; // No expiration means never expires

    // exp is in seconds, convert to milliseconds
    const expirationTime = exp * 1000;
    return Date.now() >= expirationTime;
  });

  /**
   * Get time until token expires in seconds
   * Returns 0 if already expired or no expiration
   */
  const expiresIn = computed(() => {
    if (!_payload.value) return 0;

    const { exp } = _payload.value;
    if (!exp) return Infinity;

    const expirationTime = exp * 1000;
    const remaining = Math.floor((expirationTime - Date.now()) / 1000);
    return Math.max(0, remaining);
  });

  /**
   * Check if user has admin role
   */
  const isAdmin = computed(() => {
    return _payload.value?.role === "admin";
  });

  /**
   * Check if user has operator role
   */
  const isOperator = computed(() => {
    return _payload.value?.role === "operator";
  });

  /**
   * Check if user has specific role
   */
  const hasRole = (role: "admin" | "operator"): boolean => {
    return _payload.value?.role === role;
  };

  /**
   * Get the subject (user identifier) from token
   */
  const subject = computed(() => {
    return _payload.value?.sub ?? null;
  });

  /**
   * Get the token with Bearer prefix
   */
  const authorizationHeader = computed(() => {
    if (!_token.value) return "";
    return `${tokenPrefix}${_token.value}`;
  });

  /**
   * Set token from string
   * Parses and stores the token
   */
  const setToken = (token: string) => {
    _token.value = token;
    _payload.value = decodeToken(token);

    // Optionally store in localStorage
    if (typeof window !== "undefined" && token) {
      localStorage.setItem(storageKey, token);
    }
  };

  /**
   * Clear the token
   */
  const clearToken = () => {
    _token.value = "";
    _payload.value = null;

    if (typeof window !== "undefined") {
      localStorage.removeItem(storageKey);
    }
  };

  /**
   * Initialize token from localStorage
   */
  const initFromStorage = () => {
    if (typeof window === "undefined") return;

    const stored = localStorage.getItem(storageKey);
    if (stored) {
      setToken(stored);
    }
  };

  /**
   * Login with token
   * Shortcut for setToken
   */
  const login = (token: string) => {
    setToken(token);
  };

  /**
   * Logout
   * Shortcut for clearToken
   */
  const logout = () => {
    clearToken();
  };

  /**
   * Get custom claim from payload
   */
  const getClaim = <T = any>(key: string): T | undefined => {
    return _payload.value?.[key] as T | undefined;
  };

  // Initialize from storage on composable creation
  if (typeof window !== "undefined") {
    initFromStorage();
  }

  return {
    // State
    token: _token,
    payload: computed(() => _payload.value),

    // Computed
    isExpired,
    expiresIn,
    isAdmin,
    isOperator,
    subject,
    authorizationHeader,

    // Methods
    setToken,
    clearToken,
    login,
    logout,
    hasRole,
    getClaim,
    decodeToken,
    initFromStorage,
  };
};

/**
 * Type for useJWT return value
 */
export type UseJwtReturn = ReturnType<typeof useJWT>;
