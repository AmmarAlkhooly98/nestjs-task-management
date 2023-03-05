import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getTasks(getTasksFilterDto: GetTasksFilterDto): Task[] {
    const { status, search } = getTasksFilterDto;
    let tasks = this.getAllTasks();
    if (status) {
      tasks = [...tasks.filter((t) => t.status == status)];
    }
    if (search) {
      tasks = [
        ...tasks.filter((t) =>
          t.title.includes(search) || t.description.includes(search)
            ? true
            : false,
        ),
      ];
    }
    return tasks;
  }

  getAllTasks(): Task[] {
    return this.tasks;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const { title, description } = createTaskDto;
    const task: Task = {
      id: uuid(),
      title,
      description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  getTask(taskId: string): Task {
    return this.tasks.find((t) => t.id == taskId);
  }

  deleteTask(taskId: string): string {
    const taskIdx: number = this.tasks.findIndex((t) => t.id == taskId);
    if (taskIdx >= 0) {
      this.tasks.splice(taskIdx, 1);
      return 'task deleted';
    }
    return 'task not found';
  }

  updateStatus(taskId: string, status: TaskStatus): Task {
    const task: Task = this.getTask(taskId);
    task.status = status;
    return task;
  }
}
