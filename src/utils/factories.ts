import { TaskService } from '../services';
import { ProjectService } from '../services';
import { ProjectValidator, TaskValidator } from '../validators';
import { ProjectController, TaskController } from '../controllers';

export function makeTaskController() {
  const taskService = new TaskService();
  const taskValidator = new TaskValidator(taskService);
  const taskController = new TaskController(taskService, taskValidator);

  return taskController;
}

export function makeProjectController() {
  const taskService = new TaskService();
  const projectService = new ProjectService();
  const projectValidator = new ProjectValidator(projectService, taskService);
  const projectController = new ProjectController(
    taskService,
    projectService,
    projectValidator
  );

  return projectController;
}
