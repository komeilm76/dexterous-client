import { watch } from "fs";
import path from "path";

/**
 * Creates a debounced file watcher.
 *
 * - Uses native fs.watch (Bun compatible)
 * - Prevents double rebuilds
 * - Handles rapid file saves safely
 */
function watchFiles(
  files: readonly string[],
  onChange: () => Promise<void>,
  delay = 150,
): void {
  let timer: NodeJS.Timeout | null = null;

  const trigger = () => {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      timer = null;
      onChange().catch(console.error);
    }, delay);
  };

  for (const file of files) {
    const absPath = path.resolve(file);

    watch(absPath, { persistent: true }, (event) => {
      if (event === "change") {
        console.log(`🔁 File changed: ${file}`);
        trigger();
      }
    });
  }

  console.log("👀 Watch mode enabled");
}
export default { watchFiles };
