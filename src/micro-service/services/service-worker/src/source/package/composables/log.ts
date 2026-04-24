import chalk from "chalk";

export const useLogger = (entryTag: string) => {
  const tag = chalk.blueBright(`<[${entryTag}]>`);
  const log = (entryText: string) => {
    const text = `${tag}: ${chalk.dim(entryText)}`;
    const show = () => {
      console.log(text);
    };
    return {
      text,
      show,
    };
  };
  return {
    log,
  };
};
