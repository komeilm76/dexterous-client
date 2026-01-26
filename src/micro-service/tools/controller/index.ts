/* -------------------------------------------------------
 * Generic helper type for sync or async values
 * ----------------------------------------------------- */
type MaybePromise<T> = T | Promise<T>;

/* -------------------------------------------------------
 * Middleware task type
 * - ctx: shared mutable context
 * - next: runs next task
 * ----------------------------------------------------- */
type Middleware<CTX> = (
  ctx: CTX,
  next: () => Promise<void>,
) => MaybePromise<void>;

/* -------------------------------------------------------
 * Middleware function
 * Executes middleware tasks sequentially
 * ----------------------------------------------------- */
async function middlewareController<CTX>(
  initialContext: CTX,
  tasks: readonly Middleware<CTX>[],
): Promise<void> {
  let index = -1;

  /* ---------------------------------------------------
   * Dispatch executes task by index
   * Prevents multiple next() calls
   * ------------------------------------------------- */
  const dispatch = async (i: number): Promise<void> => {
    if (i <= index) {
      throw new Error("next() called multiple times");
    }

    index = i;

    const task = tasks[i];
    if (!task) return;

    await task(initialContext, () => dispatch(i + 1));
  };

  await dispatch(0);
}

/* -------------------------------------------------------
 * Helper function to create middleware
 * Simplifies middleware creation with type safety
 * ----------------------------------------------------- */
function makeMiddleware<CTX extends any = any>(
  handler: (ctx: CTX, next: () => Promise<void>) => MaybePromise<void>,
): Middleware<CTX> {
  return handler;
}

export default { middlewareController, makeMiddleware };
