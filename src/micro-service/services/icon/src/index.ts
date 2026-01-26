import tools from "../../../tools";
import config from "./config";
import type { IConfig } from "./schemas";
import task1 from "./tasks/task-1";

tools.controller.middlewareController<IConfig>(config, [task1()]);
