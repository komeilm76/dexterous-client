import { z, ZodArray, ZodNullable, type ZodObject, type output } from "zod";
import { toTypedSchema } from "@vee-validate/zod";
import { useField, useFieldArray, useForm } from "vee-validate";
import { computed } from "vue";
import { isEmpty } from "lodash";
export const makeForm = <SCHEMA extends ZodObject>(
  schema: SCHEMA,
  initialValues?: Partial<z.infer<SCHEMA>>,
) => {
  const formSchema = toTypedSchema(schema);
  const form = useForm({
    validationSchema: formSchema,
    // @ts-ignore
    initialValues,
  });

  const list = schema.keyof().options as string[];
  const fields = {} as {
    [key in keyof SCHEMA["shape"]]: ReturnType<
      typeof useField<z.infer<SCHEMA["shape"][key]>>
    >;
  };
  const arrayFields = {} as {
    [key in keyof SCHEMA["shape"]]: ReturnType<
      typeof useFieldArray<z.infer<SCHEMA["shape"][key]["element"]>>
    >;
  };
  list.forEach((field) => {
    if (schema.shape[field] instanceof ZodNullable) {
      if (schema.shape[field]._def.innerType instanceof ZodArray) {
        const fieldObj = useFieldArray(field);
        // @ts-ignore
        arrayFields[field] = fieldObj;
      } else {
        const fieldObj = useField(field);
        // @ts-ignore
        fields[field] = fieldObj.value;
      }
    }
    if (schema.shape[field] instanceof ZodArray) {
      const fieldObj = useFieldArray(field);
      // @ts-ignore
      arrayFields[field] = fieldObj;
    } else {
      const fieldObj = useField(field);
      // @ts-ignore
      fields[field] = fieldObj.value;
    }
  });
  const isValidForm = computed(() => {
    return isEmpty(form.errors.value) == true ? true : false;
  });
  const submitForm = (onValid: (values: output<SCHEMA>) => void) => {
    return form.handleSubmit((values, ctx) => {
      onValid(values);
    })();
  };

  return {
    fields,
    ...form,
    isValidForm,
    rawSchema: schema,
    formSchema,
    submitForm,
    arrayFields,
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
const form = makeForm(schema);

form.fields.age.value
form.fields.name.value
form.fields.skills.value.value[0]?.name