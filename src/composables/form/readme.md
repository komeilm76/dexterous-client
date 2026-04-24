# 🧩 makeForm — Smart Zod + VeeValidate Form Generator

`makeForm` is a tiny utility that automatically generates **typed Vue form fields** using:

- **Zod** (schema validation)
- **Vee-Validate** (form + fields)
- **Automatic field detection** (`useField` or `useFieldArray`)
- **Fully typed dynamic output** 🧠
- **Supports array, nullable, optional & nested schemas**

Perfect for building powerful forms with **zero manual field wiring**.

---

## 🚀 Installation

```bash
npm install make-form-generator
# or
bun add make-form-generator
# or
yarn add make-form-generator
```

---

## ✨ Features

✔ Auto-detects arrays in Zod schema  
✔ Uses `useFieldArray` automatically  
✔ Uses `useField` for normal fields  
✔ Infers field types correctly  
✔ Supports optional & nullable arrays  
✔ Schema-safe, strongly typed  

---

## 📘 Example Schema

Below is the schema **you requested** (array of objects inside schema):

```ts
import { z } from "zod";

const schema = z.object({
  identity: z.string().min(1).startsWith("/"),
  face: z.instanceof(File),
  skills: z
    .object({
      name: z.string().startsWith("..."),
      rate: z.number(),
    })
    .array()
    .optional(),
});
```

---

## 🧪 How to Use `makeForm`

```ts
import { makeForm } from "make-form-generator";
import { schema } from "./schema";

const { form, fields } = makeForm(schema, {
  identity: "/user-1",
  face: new File([""], "avatar.png"),
  skills: [
    { name: "...Vue", rate: 5 },
  ],
});
```

---

## 🔧 Resulting Fields

The function outputs:

- `identity` → `useField<string>`
- `face` → `useField<File>`
- `skills` → `useFieldArray<{ name: string; rate: number }>` ⭐

You can now use them like:

```vue
<script setup>
const { form, fields } = makeForm(schema);

// Normal field
fields.identity.value;     // string
fields.face.value;         // File

// Array field
fields.skills.fields;      // reactive array of skill items
fields.skills.append({ name: "...React", rate: 4 });
fields.skills.remove(0);
</script>
```

---

## 🏗 Example Vue Component

```vue
<script setup>
import { makeForm } from "make-form-generator";
import { schema } from "./schema";

const { form, fields } = makeForm(schema);
</script>

<template>
  <Form v-slot="{ errors }">
    <input v-model="fields.identity.value" />

    <input type="file" @change="e => fields.face.value = e.target.files[0]" />

    <div v-for="(skill, i) in fields.skills.fields" :key="skill.key">
      <input v-model="skill.name" />
      <input type="number" v-model.number="skill.rate" />
      <button @click="fields.skills.remove(i)">Remove</button>
    </div>

    <button @click="fields.skills.append({ name: '...', rate: 1 })">
      Add Skill
    </button>
  </Form>
</template>
```

---

## 🧠 Why This Exists?

Manually writing:

- `useField`
- `useFieldArray`
- Field names
- Field typing

…is repetitive and error-prone.

This tool eliminates all that by reading your **Zod schema** and generating the correct typed structure — automatically. 💡

---

## 🛡 Type Safety

`makeForm()` uses advanced TypeScript generics:

- Infers all field types  
- Unwraps Zod arrays, optional, nullable  
- Ensures output matches your schema perfectly  

You never write a string or type twice. 🔒

---

## 📤 Publishing

This package is ready for NPM.  
Just run:

```bash
npm publish
```

---

## ❤️ Contributing

Pull requests are welcome!

---

## 📄 License

MIT
