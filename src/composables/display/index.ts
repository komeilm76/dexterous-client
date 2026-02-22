import { ref, computed, onMounted, onUnmounted, readonly } from "vue";
import type { Ref, ComputedRef } from "vue";
import {
  defaultThresholds,
  defaultMobileBreakpoint,
} from "./defaultBreakpoints";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DisplayBreakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "xxl";

export type DisplayThresholds = {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  xxl: number;
};

export interface DisplayPlatform {
  android: boolean;
  ios: boolean;
  cordova: boolean;
  electron: boolean;
  chrome: boolean;
  edge: boolean;
  firefox: boolean;
  opera: boolean;
  win: boolean;
  mac: boolean;
  linux: boolean;
  touch: boolean;
  ssr: boolean;
}

export interface DisplayProps {
  mobile?: boolean | null | undefined;
  mobileBreakpoint?: number | DisplayBreakpoint | undefined;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const BREAKPOINT_ORDER: DisplayBreakpoint[] = [
  "xs",
  "sm",
  "md",
  "lg",
  "xl",
  "xxl",
];

function getPlatform(): DisplayPlatform {
  const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
  const isSsr = typeof window === "undefined";

  return {
    android: /android/i.test(ua),
    ios: /iphone|ipad|ipod/i.test(ua),
    cordova: typeof (window as any)?.cordova !== "undefined",
    electron: /electron/i.test(ua),
    chrome: /chrome/i.test(ua) && !/edge|edg/i.test(ua),
    edge: /edge|edg/i.test(ua),
    firefox: /firefox/i.test(ua),
    opera: /opera|opr/i.test(ua),
    win: /win/i.test(ua),
    mac: /mac/i.test(ua) && !/iphone|ipad|ipod/i.test(ua),
    linux: /linux/i.test(ua) && !/android/i.test(ua),
    touch:
      typeof window !== "undefined" &&
      ("ontouchstart" in window || navigator.maxTouchPoints > 0),
    ssr: isSsr,
  };
}

function getBreakpointName(
  width: number,
  thresholds: DisplayThresholds,
): DisplayBreakpoint {
  const sorted = BREAKPOINT_ORDER.slice().reverse(); // xxl → xs
  for (const bp of sorted) {
    if (width >= thresholds[bp]) return bp;
  }
  return "xs";
}

function getMobileBreakpointPx(
  mobileBreakpoint: number | DisplayBreakpoint,
  thresholds: DisplayThresholds,
): number {
  if (typeof mobileBreakpoint === "number") return mobileBreakpoint;
  return thresholds[mobileBreakpoint];
}

// ─── Composable ───────────────────────────────────────────────────────────────

export function useDisplay(
  props?: DisplayProps,
  _name?: string,
): {
  xs: Ref<boolean>;
  sm: Ref<boolean>;
  md: Ref<boolean>;
  lg: Ref<boolean>;
  xl: Ref<boolean>;
  xxl: Ref<boolean>;
  smAndUp: Ref<boolean>;
  mdAndUp: Ref<boolean>;
  lgAndUp: Ref<boolean>;
  xlAndUp: Ref<boolean>;
  smAndDown: Ref<boolean>;
  mdAndDown: Ref<boolean>;
  lgAndDown: Ref<boolean>;
  xlAndDown: Ref<boolean>;
  name: Ref<DisplayBreakpoint>;
  height: Ref<number>;
  width: Ref<number>;
  mobileBreakpoint: Ref<number | DisplayBreakpoint>;
  platform: Ref<DisplayPlatform>;
  thresholds: Ref<DisplayThresholds>;
  /** @internal */
  ssr: boolean;
  update(): void;
  displayClasses: Readonly<Ref<{ [x: string]: boolean }>>;
  mobile: ComputedRef<boolean>;
} {
  // ── State ──────────────────────────────────────────────────────────────────

  const isSsr = typeof window === "undefined";

  const thresholds = ref<DisplayThresholds>(defaultThresholds);

  const mobileBreakpointRef = ref<number | DisplayBreakpoint>(
    props?.mobileBreakpoint ?? defaultMobileBreakpoint,
  );

  const width = ref<number>(isSsr ? 0 : window.innerWidth);
  const height = ref<number>(isSsr ? 0 : window.innerHeight);
  const platform = ref<DisplayPlatform>(getPlatform());

  // ── Derived breakpoint name ────────────────────────────────────────────────

  const name = ref<DisplayBreakpoint>(
    getBreakpointName(width.value, thresholds.value),
  );

  // ── Boolean breakpoint refs ────────────────────────────────────────────────

  const xs = ref<boolean>(false);
  const sm = ref<boolean>(false);
  const md = ref<boolean>(false);
  const lg = ref<boolean>(false);
  const xl = ref<boolean>(false);
  const xxl = ref<boolean>(false);

  const smAndUp = ref<boolean>(false);
  const mdAndUp = ref<boolean>(false);
  const lgAndUp = ref<boolean>(false);
  const xlAndUp = ref<boolean>(false);

  const smAndDown = ref<boolean>(false);
  const mdAndDown = ref<boolean>(false);
  const lgAndDown = ref<boolean>(false);
  const xlAndDown = ref<boolean>(false);

  // ── Mobile computed ────────────────────────────────────────────────────────

  const mobile = computed<boolean>(() => {
    // If props.mobile is explicitly set, use it
    if (props?.mobile != null) return props.mobile;

    const mobilePx = getMobileBreakpointPx(
      mobileBreakpointRef.value,
      thresholds.value,
    );
    return width.value < mobilePx;
  });

  // ── Display classes ────────────────────────────────────────────────────────

  const displayClasses = readonly(
    computed<{ [x: string]: boolean }>(() => ({
      "display-xs": xs.value,
      "display-sm": sm.value,
      "display-md": md.value,
      "display-lg": lg.value,
      "display-xl": xl.value,
      "display-xxl": xxl.value,
      "display-mobile": mobile.value,
    })),
  );

  // ── Update function ────────────────────────────────────────────────────────

  function update(): void {
    if (typeof window === "undefined") return;

    width.value = window.innerWidth;
    height.value = window.innerHeight;
    platform.value = getPlatform();

    const t = thresholds.value;
    const w = width.value;

    name.value = getBreakpointName(w, t);

    xs.value = w >= t.xs && w < t.sm;
    sm.value = w >= t.sm && w < t.md;
    md.value = w >= t.md && w < t.lg;
    lg.value = w >= t.lg && w < t.xl;
    xl.value = w >= t.xl && w < t.xxl;
    xxl.value = w >= t.xxl;

    smAndUp.value = w >= t.sm;
    mdAndUp.value = w >= t.md;
    lgAndUp.value = w >= t.lg;
    xlAndUp.value = w >= t.xl;

    smAndDown.value = w < t.md;
    mdAndDown.value = w < t.lg;
    lgAndDown.value = w < t.xl;
    xlAndDown.value = w < t.xxl;
  }

  // ── Lifecycle ──────────────────────────────────────────────────────────────

  // Run initial update
  update();

  onMounted(() => {
    if (typeof window !== "undefined") {
      window.addEventListener("resize", update);
      update();
    }
  });

  onUnmounted(() => {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", update);
    }
  });

  return {
    xs,
    sm,
    md,
    lg,
    xl,
    xxl,
    smAndUp,
    mdAndUp,
    lgAndUp,
    xlAndUp,
    smAndDown,
    mdAndDown,
    lgAndDown,
    xlAndDown,
    name,
    height,
    width,
    mobileBreakpoint: mobileBreakpointRef,
    platform,
    thresholds,
    ssr: isSsr,
    update,
    displayClasses,
    mobile,
  };
}
