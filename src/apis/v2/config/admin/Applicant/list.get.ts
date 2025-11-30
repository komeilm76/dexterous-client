import kmApi from "km-api";
import { z } from "zod";

const config = kmApi.makeApiConfig({
  path: `/admin/Applicant/list`,
  method: "get",
  auth: "YES",
  disable: "NO",
  request: {
    body: z.undefined(),
    params: z.object({}),
    query: z.object({
      PhoneNumber: z.string().optional(),
      NationalCode: z.string().optional(),
      page: z.number().int().optional(),
      pageSize: z.number().int().optional(),
    }),
  },
  response: {
    data: z.object({
      items: z
        .array(
          z.object({
            id: z.string().transform((v) => {
              /* v is int64 */ return v;
            }),
            gender: z.boolean(),
            firstName: z.string().nullable(),
            lastName: z.string().nullable(),
            fullName: z.string().nullable(),
            phoneNumber: z.string().nullable(),
            nationalCode: z.string().nullable(),
            registerDateTime: z.string().nullable(),
            birthDate: z.string().nullable(),
            provinceName: z.string().nullable(),
            provinceId: z
              .string()
              .transform((v) => {
                /* v is int64 */ return v;
              })
              .nullable(),
            cityName: z.string().nullable(),
            cityId: z
              .string()
              .transform((v) => {
                /* v is int64 */ return v;
              })
              .nullable(),
          })
        )
        .nullable(),
      page: z.number().int(),
      pageSize: z.number().int(),
      totalPages: z.number().int(),
      totalCounts: z.number().int(),
      hasMore: z.boolean(),
    }),
  },
});
export default { config };
