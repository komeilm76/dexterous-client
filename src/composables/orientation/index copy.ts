import { ref, onMounted, onUnmounted } from "vue";
import { useScreenOrientation, type OrientationLockType } from "@vueuse/core";
/**
 * Requests permission for device motion/orientation sensors.
 * Required on iOS Safari. On other browsers, this simply resolves to true.
 *
 * Must be called as a result of a user gesture (e.g., click/tap).
 */
async function requestSensorPermission(): Promise<boolean> {
  // iOS-Safari specific behavior
  // @ts-ignore
  if (typeof DeviceMotionEvent?.requestPermission === "function") {
    try {
      // @ts-ignore
      const result = await DeviceMotionEvent.requestPermission();
      return result === "granted";
    } catch {
      return false;
    }
  }
  return true; // Other browsers do not require permission
}

/**
 * Computes device rotation angle based on deviceorientation event.
 * This detects real physical rotation even when orientation is locked.
 *
 * Angle result:
 *   0°   = Portrait upright
 *   90°  = Landscape (right)
 *  -90°  = Landscape (left)
 *  180°  = Portrait upside-down
 */
function calculateRotationAngle(
  beta: number | null,
  gamma: number | null
): number {
  if (beta == null || gamma == null) return 0;

  // Determine whether device is more tilted left/right or front/back
  if (Math.abs(gamma) > Math.abs(beta)) {
    return gamma > 0 ? 90 : -90; // Landscape
  } else {
    return beta > 0 ? 0 : 180; // Portrait
  }
}

/**
 * Vue Composable:
 * Locks orientation to portrait AND gives you real device rotation angle.
 *
 * angle: reactive rotation angle (0, 90, -90, 180)
 * requestPermission: must be called after a user interaction on iOS
 * lock: lock screen orientation and start listening
 * unlock: stop listening and unlock orientation
 */
export function useDeviceOrientationLock() {
  const { lockOrientation, unlockOrientation, orientation, isSupported } =
    useScreenOrientation();
  const angle = ref<number>(0);
  let listener: ((e: DeviceOrientationEvent) => void) | null = null;

  /**
   * Starts listening to device orientation sensor events.
   * Should be called after sensor permission is granted.
   */
  function startListening() {
    if (listener) return; // prevent duplicate listeners

    listener = (event: DeviceOrientationEvent) => {
      const { beta, gamma } = event;
      angle.value = calculateRotationAngle(beta ?? null, gamma ?? null);
    };

    window.addEventListener("deviceorientation", listener);
  }

  /**
   * Stops listening to rotation events.
   */
  function stopListening() {
    if (!listener) return;
    window.removeEventListener("deviceorientation", listener);
    listener = null;
  }

  /**
   * Public: Request sensor access + lock orientation + start rotation events.
   * Call this once after user interaction.
   */
  async function lock(type: OrientationLockType) {
    const allowed = await requestSensorPermission();
    if (!allowed) return false;
    await lockOrientation(type);
    startListening();
    return true;
  }

  /**
   * Public: Unlock orientation and stop listening.
   */
  async function unlock() {
    stopListening();
    await unlockOrientation();
  }

  // Clean up automatically when component unmounts
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
