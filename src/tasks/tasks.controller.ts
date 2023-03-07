import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  getTasks(@Query() getTasksFilterDto: GetTasksFilterDto): Promise<Task[]> {
    return this.tasksService.getTasks(getTasksFilterDto);
  }

  @Post()
  createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.tasksService.createTask(createTaskDto);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string): Promise<Task> {
    return this.tasksService.getTaskById(id);
  }

  @Get('/:id')
  getTask(@Param('id') taskId: string): Promise<Task> {
    return this.tasksService.getTaskById(taskId);
  }

  @Delete('/:id')
  deleteTask(@Param('id') taskId: string): Promise<string> {
    return this.tasksService.deleteTask(taskId);
  }

  @Patch('/:id/status')
  updateStatus(
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @Param('id') taskId: string,
  ): Promise<Task> {
    return this.tasksService.updateStatus(taskId, updateTaskStatusDto);
  }
}
