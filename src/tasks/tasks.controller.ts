import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Controller('tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query() getTasksFilterDto: GetTasksFilterDto): Task[] {
    if (Object.keys(getTasksFilterDto).length) {
      return this.tasksService.getTasks(getTasksFilterDto);
    }
    return this.tasksService.getAllTasks();
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Task {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get('/:id')
  getTask(@Param('id') taskId: string) {
    return this.tasksService.getTask(taskId);
  }

  @Delete('/:id')
  deleteTask(@Param('id') taskId: string): string {
    return this.tasksService.deleteTask(taskId);
  }

  @Patch('/:id/status')
  updateStatus(
    @Body('status') status: TaskStatus,
    @Param('id') taskId: string,
  ): Task {
    return this.tasksService.updateStatus(taskId, status);
  }
}
