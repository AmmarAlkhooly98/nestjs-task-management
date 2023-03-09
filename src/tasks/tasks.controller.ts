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
import { GetUser } from 'src/auth/get-user.decorator';
import { User } from 'src/auth/auth.entity';
import { ApiBearerAuth, ApiBody, ApiQuery, ApiTags } from '@nestjs/swagger';
import { TaskStatus } from './task-status.enum';

@ApiBearerAuth()
@Controller('tasks')
@UseGuards(AuthGuard())
@ApiTags('Tasks')
export class TasksController {
  constructor(private tasksService: TasksService) {}

  @Get()
  @ApiQuery({ name: 'status', enum: TaskStatus, required: false })
  getTasks(
    @Query() getTasksFilterDto: GetTasksFilterDto,
    @GetUser() user: User,
  ): Promise<Task[]> {
    return this.tasksService.getTasks(getTasksFilterDto, user);
  }

  @Post()
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.createTask(createTaskDto, user);
  }

  @Get('/:id')
  getTaskById(@Param('id') id: string, @GetUser() user: User): Promise<Task> {
    return this.tasksService.getTaskById(id, user);
  }

  @Delete('/:id')
  deleteTask(
    @Param('id') taskId: string,
    @GetUser() user: User,
  ): Promise<string> {
    return this.tasksService.deleteTask(taskId, user);
  }

  @Patch('/:id/status')
  @ApiBody({ type: UpdateTaskStatusDto })
  updateStatus(
    @Body() updateTaskStatusDto: UpdateTaskStatusDto,
    @Param('id') taskId: string,
    @GetUser() user: User,
  ): Promise<Task> {
    return this.tasksService.updateStatus(taskId, updateTaskStatusDto, user);
  }
}
