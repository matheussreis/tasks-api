import TaskService from '../services/tasks';
import { TaskValidator } from '../validators';
import { TaskController } from '../controllers';

export function makeTaskController() {
  const taskService = new TaskService();
  const taskValidator = new TaskValidator();
  const taskController = new TaskController(taskService, taskValidator);

  return taskController;
}
