import type { DisplayBreakpoint, DisplayThresholds } from './'

export type BreakpointPreset = 'vuetify' | 'tailwind' | 'dexterous'

/**
 * Vuetify default breakpoints
 * xs: 0 - 599
 * sm: 600 - 959
 * md: 960 - 1279
 * lg: 1280 - 1919
 * xl: 1920 - 2559
 * xxl: 2560+
 */
export const vuetifyBreakpoints: DisplayThresholds = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
  xxl: 2560,
}

/**
 * Tailwind CSS default breakpoints
 * xs: 0 - 639
 * sm: 640 - 767
 * md: 768 - 1023
 * lg: 1024 - 1279
 * xl: 1280 - 1535
 * xxl: 1536+
 */
export const tailwindBreakpoints: DisplayThresholds = {
  xs: 0,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  xxl: 1536,
}

/**
 * Dexterous default breakpoints
 * xs: 0 - 479
 * sm: 480 - 767
 * md: 768 - 1023
 * lg: 1024 - 1439
 * xl: 1440 - 1919
 * xxl: 1920+
 */
export const dexterousBreakpoints: DisplayThresholds = {
  xs: 0,
  sm: 480,
  md: 768,
  lg: 1024,
  xl: 1440,
  xxl: 1920,
}

export const breakpointPresets: Record<BreakpointPreset, DisplayThresholds> = {
  vuetify: vuetifyBreakpoints,
  tailwind: tailwindBreakpoints,
  dexterous: dexterousBreakpoints,
}

export const defaultMobileBreakpoint: DisplayBreakpoint = 'sm'

export const defaultThresholds: DisplayThresholds = dexterousBreakpoints
