import kmPalette from "km-palette";
import config from "./config";
import tools from "../../../tools";
import task1 from "./tasks/task-1";
import task2 from "./tasks/task-2";
import task3 from "./tasks/task-3";
import task4 from "./tasks/task-4";
import task5 from "./tasks/task-5";
import type { IConfig } from "./schema";

tools.controller.middlewareController<IConfig>(config, [
  task1(),
  task2(),
  task3(),
  task4(),
  task5(),
]);
 