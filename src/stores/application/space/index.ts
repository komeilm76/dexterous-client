import { useDisplay } from "@/composables/display";
import { defineStore } from "pinia";
import { computed } from "vue";
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
export const useAppSpace = defineStore(
  "app_space",
  () => {
    const { mdAndDown, lgAndDown, smAndDown } = useDisplay();
    const paddingCompact = computed(() => {
      if (smAndDown.value == true) {
        return {
          all: "p-0.5!",
          start: "ps-0.5!",
          end: "pe-0.5!",
          x: "px-0.5!",
          y: "py-0.5!",
          left: "pl-0.5!",
          right: "pr-0.5!",
          top: "pt-0.5!",
          bottom: "pb-0.5!",
        };
      } else if (mdAndDown.value == true) {
        return {
          all: "p-1!",
          start: "ps-1!",
          end: "pe-1!",
          x: "px-1!",
          y: "py-1!",
          left: "pl-1!",
          right: "pr-1!",
          top: "pt-1!",
          bottom: "pb-1!",
        };
      } else if (lgAndDown.value == true) {
        return {
          all: "p-2!",
          start: "ps-2!",
          end: "pe-2!",
          x: "px-2!",
          y: "py-2!",
          left: "pl-2!",
          right: "pr-2!",
          top: "pt-2!",
          bottom: "pb-2!",
        };
      } else {
        return {
          all: "p-2!",
          start: "ps-2!",
          end: "pe-2!",
          x: "px-2!",
          y: "py-2!",
          left: "pl-2!",
          right: "pr-2!",
          top: "pt-2!",
          bottom: "pb-2!",
        };
      }
    });
    const paddingComfortable = computed(() => {
      if (smAndDown.value == true) {
        return {
          all: "p-1!",
          start: "ps-1!",
          end: "pe-1!",
          x: "px-1!",
          y: "py-1!",
          left: "pl-1!",
          right: "pr-1!",
          top: "pt-1!",
          bottom: "pb-1!",
        };
      } else if (mdAndDown.value == true) {
        return {
          all: "p-2!",
          start: "ps-2!",
          end: "pe-2!",
          x: "px-2!",
          y: "py-2!",
          left: "pl-2!",
          right: "pr-2!",
          top: "pt-2!",
          bottom: "pb-2!",
        };
      } else if (lgAndDown.value == true) {
        return {
          all: "p-3!",
          start: "ps-3!",
          end: "pe-3!",
          x: "px-3!",
          y: "py-3!",
          left: "pl-3!",
          right: "pr-3!",
          top: "pt-3!",
          bottom: "pb-3!",
        };
      } else {
        return {
          all: "p-3!",
          start: "ps-3!",
          end: "pe-3!",
          x: "px-3!",
          y: "py-3!",
          left: "pl-3!",
          right: "pr-3!",
          top: "pt-3!",
          bottom: "pb-3!",
        };
      }
    });
    const padding = computed(() => {
      if (smAndDown.value == true) {
        return {
          all: "p-2!",
          start: "ps-2!",
          end: "pe-2!",
          x: "px-2!",
          y: "py-2!",
          left: "pl-2!",
          right: "pr-2!",
          top: "pt-2!",
          bottom: "pb-2!",
        };
      } else if (mdAndDown.value == true) {
        return {
          all: "p-3!",
          start: "ps-3!",
          end: "pe-3!",
          x: "px-3!",
          y: "py-3!",
          left: "pl-3!",
          right: "pr-3!",
          top: "pt-3!",
          bottom: "pb-3!",
        };
      } else if (lgAndDown.value == true) {
        return {
          all: "p-4!",
          start: "ps-4!",
          end: "pe-4!",
          x: "px-4!",
          y: "py-4!",
          left: "pl-4!",
          right: "pr-4!",
          top: "pt-4!",
          bottom: "pb-4!",
        };
      } else {
        return {
          all: "p-4!",
          start: "ps-4!",
          end: "pe-4!",
          x: "px-4!",
          y: "py-4!",
          left: "pl-4!",
          right: "pr-4!",
          top: "pt-4!",
          bottom: "pb-4!",
        };
      }
    });
    const marginCompact = computed(() => {
      if (smAndDown.value == true) {
        return {
          all: "m-0.5!",
          start: "ms-0.5!",
          end: "me-0.5!",
          x: "mx-0.5!",
          y: "my-0.5!",
          left: "ml-0.5!",
          right: "mr-0.5!",
          top: "mt-0.5!",
          bottom: "mb-0.5!",
        };
      } else if (mdAndDown.value == true) {
        return {
          all: "m-1!",
          start: "ms-1!",
          end: "me-1!",
          x: "mx-1!",
          y: "my-1!",
          left: "ml-1!",
          right: "mr-1!",
          top: "mt-1!",
          bottom: "mb-1!",
        };
      } else if (lgAndDown.value == true) {
        return {
          all: "m-2!",
          start: "ms-2!",
          end: "me-2!",
          x: "mx-2!",
          y: "my-2!",
          left: "ml-2!",
          right: "mr-2!",
          top: "mt-2!",
          bottom: "mb-2!",
        };
      } else {
        return {
          all: "m-2!",
          start: "ms-2!",
          end: "me-2!",
          x: "mx-2!",
          y: "my-2!",
          left: "ml-2!",
          right: "mr-2!",
          top: "mt-2!",
          bottom: "mb-2!",
        };
      }
    });
    const marginComfortable = computed(() => {
      if (smAndDown.value == true) {
        return {
          all: "m-1!",
          start: "ms-1!",
          end: "me-1!",
          x: "mx-1!",
          y: "my-1!",
          left: "ml-1!",
          right: "mr-1!",
          top: "mt-1!",
          bottom: "mb-1!",
        };
      } else if (mdAndDown.value == true) {
        return {
          all: "m-2!",
          start: "ms-2!",
          end: "me-2!",
          x: "mx-2!",
          y: "my-2!",
          left: "ml-2!",
          right: "mr-2!",
          top: "mt-2!",
          bottom: "mb-2!",
        };
      } else if (lgAndDown.value == true) {
        return {
          all: "m-3!",
          start: "ms-3!",
          end: "me-3!",
          x: "mx-3!",
          y: "my-3!",
          left: "ml-3!",
          right: "mr-3!",
          top: "mt-3!",
          bottom: "mb-3!",
        };
      } else {
        return {
          all: "m-3!",
          start: "ms-3!",
          end: "me-3!",
          x: "mx-3!",
          y: "my-3!",
          left: "ml-3!",
          right: "mr-3!",
          top: "mt-3!",
          bottom: "mb-3!",
        };
      }
    });
    const margin = computed(() => {
      if (smAndDown.value == true) {
        return {
          all: "m-2!",
          start: "ms-2!",
          end: "me-2!",
          x: "mx-2!",
          y: "my-2!",
          left: "ml-2!",
          right: "mr-2!",
          top: "mt-2!",
          bottom: "mb-2!",
        };
      } else if (mdAndDown.value == true) {
        return {
          all: "m-3!",
          start: "ms-3!",
          end: "me-3!",
          x: "mx-3!",
          y: "my-3!",
          left: "ml-3!",
          right: "mr-3!",
          top: "mt-3!",
          bottom: "mb-3!",
        };
      } else if (lgAndDown.value == true) {
        return {
          all: "m-4!",
          start: "ms-4!",
          end: "me-4!",
          x: "mx-4!",
          y: "my-4!",
          left: "ml-4!",
          right: "mr-4!",
          top: "mt-4!",
          bottom: "mb-4!",
        };
      } else {
        return {
          all: "m-4!",
          start: "ms-4!",
          end: "me-4!",
          x: "mx-4!",
          y: "my-4!",
          left: "ml-4!",
          right: "mr-4!",
          top: "mt-4!",
          bottom: "mb-4!",
        };
      }
    });
    return {
      padding,
      paddingComfortable,
      paddingCompact,
      margin,
      marginComfortable,
      marginCompact,
    };
  },
  {
    persist: {
      pick: [],
      serializer: {
        deserialize: parse,
        serialize: stringify,
      },
    },
  },
);
