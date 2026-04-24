import { ref, onUnmounted } from "vue";
import { useScreenOrientation, type OrientationLockType } from "@vueuse/core";

/**
 * Requests permission for device orientation sensors.
 *
 * REQUIRED on iOS Safari.
 * MUST be called inside a user gesture (click / touch).
 *
 * Android & Desktop browsers resolve immediately.
 */
async function requestSensorPermission(): Promise<boolean> {
  // iOS Safari only
  // @ts-ignore
  if (typeof DeviceOrientationEvent?.requestPermission === "function") {
    try {
      // @ts-ignore
      const result = await DeviceOrientationEvent.requestPermission();
      return result === "granted";
    } catch {
      return false;
    }
  }

  // Android / Desktop
  return true;
}

/**
 * Computes physical device rotation based on sensor data.
 * Works even when screen orientation is locked.
 *
 * Returned angle:
 *   0°   → Portrait upright
 *   90°  → Landscape right
 *  -90°  → Landscape left
 *  180°  → Portrait upside-down
 */
function calculateRotationAngle(
  beta: number | null,
  gamma: number | null
): number {
  if (beta == null || gamma == null) return 0;

  if (Math.abs(gamma) > Math.abs(beta)) {
    return gamma > 0 ? 90 : -90;
  }

  return beta > 0 ? 0 : 180;
}

/**
 * Vue Composable
 *
 * Locks screen orientation AND exposes real physical rotation angle.
 * Fully supports Android + iOS Safari.
 */
export function useDeviceOrientationLock() {
  const { lockOrientation, unlockOrientation, isSupported } =
    useScreenOrientation();

  const angle = ref<number>(0);
  let listener: ((e: DeviceOrientationEvent) => void) | null = null;

  /**
   * Starts listening to physical device rotation.
   * Permission MUST already be granted on iOS.
   */
  function startListening() {
    if (listener) return;

    listener = (event: DeviceOrientationEvent) => {
      angle.value = calculateRotationAngle(
        event.beta ?? null,
        event.gamma ?? null
      );
    };

    window.addEventListener("deviceorientation", listener, {
      passive: true,
    });
  }

  /**
   * Stops listening to device rotation.
   */
  function stopListening() {
    if (!listener) return;

    window.removeEventListener("deviceorientation", listener);
    listener = null;
  }

  /**
   * Locks screen orientation and enables rotation tracking.
   *
   * ⚠️ Must be called from a user interaction on iOS.
   */
  async function lock(type: OrientationLockType): Promise<boolean> {
    const allowed = await requestSensorPermission();
    if (!allowed) return false;

    // iOS may reject silently — safe to ignore
    await lockOrientation(type).catch(() => {});

    startListening();
    return true;
  }

  /**
   * Unlocks screen orientation and stops rotation tracking.
   */
  async function unlock() {
    stopListening();
    unlockOrientation();
  }

  /**
   * Cleanup on component unmount
   */
  onUnmounted(() => {
    stopListening();
  });

  return {
    angle,
    lock,
    unlock,
    requestPermission: requestSensorPermission,
    isSupported,
  };
}
