import {
  z,
  ZodArray,
  ZodNullable,
  ZodObject,
  ZodOptional,
  type output,
} from "zod/v4";
import { toTypedSchema } from "@vee-validate/zod";
import { useField, useFieldArray, useForm } from "vee-validate";
import { computed, reactive, ref } from "vue";
import _ from "lodash";

const isZodArray = (type: any): type is ZodArray<any> => {
  if (type instanceof ZodArray) return true;
  if (type instanceof ZodNullable && type.unwrap() instanceof ZodArray)
    return true;
  if (type instanceof ZodOptional && type.unwrap() instanceof ZodArray)
    return true;
  return false;
};

type UnwrapZodArray<T> =
  T extends z.ZodArray<infer U>
    ? U
    : T extends z.ZodNullable<infer N>
      ? N extends z.ZodArray<infer U>
        ? U
        : never
      : T extends z.ZodOptional<infer O>
        ? O extends z.ZodArray<infer U>
          ? U
          : never
        : never;

type InferZodValueType<T> = T extends z.ZodTypeAny ? z.infer<T> : never;

export type DYN_OUTPUT<SCHEMA extends ZodObject> = {
  [K in keyof SCHEMA["shape"]]: SCHEMA["shape"][K] extends z.ZodArray<any>
    ? ReturnType<
        typeof useFieldArray<
          InferZodValueType<UnwrapZodArray<SCHEMA["shape"][K]>>
        >
      >
    : SCHEMA["shape"][K] extends z.ZodNullable<z.ZodArray<any>>
      ? ReturnType<
          typeof useFieldArray<
            InferZodValueType<UnwrapZodArray<SCHEMA["shape"][K]>>
          >
        >
      : ReturnType<typeof useField<InferZodValueType<SCHEMA["shape"][K]>>>;
};

export const makeForm = <
  SCHEMA extends ZodObject,
  VALUES extends z.infer<SCHEMA> = z.infer<SCHEMA>,
  KEY extends keyof VALUES = keyof VALUES,
  OUTPUT extends { [key in KEY]: ReturnType<typeof useField<VALUES[key]>> } = {
    [key in KEY]: ReturnType<typeof useField<VALUES[key]>>;
  },
  DYN_OUTPUT extends {
    [K in keyof SCHEMA["shape"]]: SCHEMA["shape"][K] extends z.ZodArray<any>
      ? ReturnType<
          typeof useFieldArray<
            InferZodValueType<UnwrapZodArray<SCHEMA["shape"][K]>>
          >
        >
      : SCHEMA["shape"][K] extends z.ZodNullable<z.ZodArray<any>>
        ? ReturnType<
            typeof useFieldArray<
              InferZodValueType<UnwrapZodArray<SCHEMA["shape"][K]>>
            >
          >
        : SCHEMA["shape"][K] extends z.ZodOptional<z.ZodArray<any>>
          ? ReturnType<
              typeof useFieldArray<
                InferZodValueType<UnwrapZodArray<SCHEMA["shape"][K]>>
              >
            >
          : ReturnType<typeof useField<InferZodValueType<SCHEMA["shape"][K]>>>;
  } = {
    [K in keyof SCHEMA["shape"]]: SCHEMA["shape"][K] extends z.ZodArray<any>
      ? ReturnType<
          typeof useFieldArray<
            InferZodValueType<UnwrapZodArray<SCHEMA["shape"][K]>>
          >
        >
      : SCHEMA["shape"][K] extends z.ZodNullable<z.ZodArray<any>>
        ? ReturnType<
            typeof useFieldArray<
              InferZodValueType<UnwrapZodArray<SCHEMA["shape"][K]>>
            >
          >
        : SCHEMA["shape"][K] extends z.ZodOptional<z.ZodArray<any>>
          ? ReturnType<
              typeof useFieldArray<
                InferZodValueType<UnwrapZodArray<SCHEMA["shape"][K]>>
              >
            >
          : ReturnType<typeof useField<InferZodValueType<SCHEMA["shape"][K]>>>;
  },
>(
  schema: SCHEMA,
  initialValues?: Partial<z.infer<SCHEMA>>,
) => {
  const formSchema = toTypedSchema(schema);
  const form = useForm<z.infer<SCHEMA>>({
    validationSchema: formSchema,
    // @ts-ignore
    initialValues,
  });

  // @ts-ignore
  const fields = ref<DYN_OUTPUT>({});

  const fieldKeys = schema.keyof().options as SCHEMA["shape"];
  for (const field in fieldKeys) {
    const key = fieldKeys[field];
    if (isZodArray(schema.shape[key]) == true) {
      fields.value[key] = useFieldArray(key);
    } else {
      fields.value[key] = useField(key);
    }
  }

  const isValidForm = computed(() => {
    return _.isEmpty(form.errors.value) == true ? true : false;
  });
  const submitForm = (onValid: (values: output<SCHEMA>) => void) => {
    return form.handleSubmit((values, ctx) => {
      onValid(values as output<SCHEMA>);
    })();
  };

  return {
    form,
    fields,
    rawSchema: schema,
    formSchema,
    isValidForm,
    submitForm,
  };
};

const schema = z.object({
  name: z.string(),
  age: z.number(),
  skills: z
    .object({
      name: z.string(),
      score: z.number(),
    })
    .array(),
});

const form = makeForm(schema, {});

form.fields.value.age.value;
form.fields.value.name.value;
form.fields.value.skills.insert(1, { name: "", score: 0 });
