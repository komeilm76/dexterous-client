import tools from "../../../tools";
import task1 from "./tasks/task-1";
import task2 from "./tasks/task-2";
import task3 from "./tasks/task-3";
import task4 from "./tasks/task-4";
import task5 from "./tasks/task-5";
import task6 from "./tasks/task-6";
import task7 from "./tasks/task-7";
import config from "./config";
import type { IConfig } from "./schemas";
tools.controller.middlewareController<IConfig>(config, [
  task1(),
  task2(),
  task3(),
  task4(),
  task5(),
  task6(),
  task7(),
]);
