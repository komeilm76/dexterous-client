import z from "zod";

const eventSchema = {
  fromApp: z.object({
    name: z.literal("from-app:palette"),
    data: z.string().array(),
  }),
  fromWorker: z.object({
    name: z.literal("from-worker:palette"),
    data: z.string().array(),
  }),
};

export default { eventSchema };
