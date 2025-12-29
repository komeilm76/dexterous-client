const log = (step: { value: number }, stringTemplate: string, tag?: string) => {
  step.value = step.value + 1;
  if (tag) {
    const message = stringTemplate.replace("$", ` #${step.value}: ${tag} `);
    console.log(message);
  } else {
    const message = stringTemplate.replace("$", ` ${step.value} `);
    console.log(message);
  }
};
export default { log };
