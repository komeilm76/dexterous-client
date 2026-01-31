import tools from "../../../../tools";
export default () => {
  return tools.controller.makeMiddleware(async (config, next) => {
    // log
    const { log } = tools.logger.instance("[micro-service/palette/task-3]($)");
    log("start");
    // -----------------------------------------
  });
};
