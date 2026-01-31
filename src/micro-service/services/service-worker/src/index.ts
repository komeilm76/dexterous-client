/**
 * Entry point for running build tasks
 */
import tools from "../../../tools";
import task1 from "./tasks/task-1";
import task2 from "./tasks/task-2";
import task3 from "./tasks/task-3";
import config from "./config";
tools.controller.middlewareController(config, [task1(), task2(), task3()]);
