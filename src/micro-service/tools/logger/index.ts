import chalk from "chalk";
const log = (step: { value: number }, stringTemplate: string, tag?: string) => {
  step.value = step.value + 1;
  if (tag) {
    const message = stringTemplate.replace(
      "$",
      ` ${chalk.green(chalk.bold(`#${step.value}`))}: ${chalk.yellow(tag)} `,
    );
    console.log(chalk.dim(chalk.black(message)));
  } else {
    const message = stringTemplate.replace("$", ` ${chalk.green(chalk.bold(step.value))} `);
    console.log(chalk.dim(chalk.black(message)));
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
