const wait = async (time: number) => {
  return new Promise((rs, rj) => {
    setTimeout(async () => {
      rs(true);
    }, time);
  });
};
export default { wait };
