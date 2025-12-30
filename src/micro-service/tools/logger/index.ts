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
const instance = (template: string) => {
  const step = { value: 0 };
  return {
    log: (tag: string) => {
      return log(step, template, tag);
    },
  };
};
export default { log, instance };
