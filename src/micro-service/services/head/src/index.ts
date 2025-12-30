import tools from "../../../tools";
import config from "./config";
import task1 from "./tasks/task-1";

tools.controller.middlewareController(config, [task1()]);
