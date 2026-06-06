import z from "zod";

const postSchema = z.object({
  id: z.string().uuid(),
  title: z.string(),
  content: z.string(),
  authorId: z.string().uuid(),
  createdAt: z.string().datetime(),
});

export default { postSchema };
