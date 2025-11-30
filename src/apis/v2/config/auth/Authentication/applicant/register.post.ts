import kmApi from "km-api";
import { z } from "zod";

const config = kmApi.makeApiConfig({
  path: `/auth/Authentication/applicant/register`,
  method: "post",
  auth: "NO",
  disable: "NO",
  request: {
    body: z.object({
      phoneNumber: z.string().nullable(),
      password: z.string().nullable(),
      firstName: z.string().nullable(),
      lastName: z.string().nullable(),
      nationalCode: z.string().nullable(),
      birthDate: z
        .string()
        .transform((v) => /* v is date-time */ new Date(v).toISOString())
        .pipe(z.string()),
      cityId: z.string().transform((v) => {
        /* v is int64 */ return v;
      }),
      gender: z.boolean(),
    }),
    params: z.object({}),
    query: z.object({}),
  },
  response: {
    data: z.object({}),
  },
});
export default { config };
