import z from "zod";

const errorSchema = z.object({ message: z.string(), code: z.number().int() });

export default { errorSchema };
