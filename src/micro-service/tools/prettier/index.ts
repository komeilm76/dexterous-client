import prettier from "prettier";

type IOption = prettier.Options;
const pretty = async (data: string, entryOptions: IOption) => {
  return await prettier.format(data, entryOptions);
};
export default { pretty };
