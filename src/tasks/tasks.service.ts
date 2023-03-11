import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { UpdateTaskStatusDto } from './dto/update-task-status.dto';
import { Task } from './task.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/auth.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}
  async createTask(createTaskDto: CreateTaskDto, user: User): Promise<Task> {
    try {
      const { title, description } = createTaskDto;
      const task = this.taskRepository.create({
        title,
        description,
        user,
      });
      await this.taskRepository.save(task);
      return task;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getTasks(
    getTasksFilterDto: GetTasksFilterDto,
    user: User,
  ): Promise<Task[]> {
    try {
      const { status, search } = getTasksFilterDto;

      const query = this.taskRepository.createQueryBuilder('task');

      query.where({ user });
      if (status) {
        query.andWhere('task.status = :status', { status });
      }
      if (search) {
        query.andWhere(
          '(LOWER(task.title) LIKE LOWER(:search) OR LOWER(task.description) LIKE LOWER(:search))',
          { search: `%${search}%` },
        );
      }
      const tasks = query.getMany();
      return tasks;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async getTaskById(id: string, user: User): Promise<Task> {
    try {
      const task = await this.taskRepository.findOne({ where: { id, user } });
      if (!task) {
        throw new NotFoundException();
      }
      return task;
    } catch (e) {
      if (e.code === '22P02') {
        throw new NotFoundException('Invalid task ID');
      } else if (e.status === 404) {
        throw new NotFoundException(`Task with id: "${id}" not found`);
      }
      throw new InternalServerErrorException();
    }
  }

  async updateStatus(
    id: string,
    updateTaskStatusDto: UpdateTaskStatusDto,
    user: User,
  ): Promise<Task> {
    try {
      const { status } = updateTaskStatusDto;
      const task = await this.getTaskById(id, user);
      task.status = status;
      await this.taskRepository.save(task);
      return task;
    } catch (e) {
      throw new InternalServerErrorException();
    }
  }

  async deleteTask(id: string, user: User): Promise<string> {
    try {
      const deleted = await this.taskRepository.delete({ id, user });
      if (!deleted.affected) {
        throw new NotFoundException();
      }
      return 'Task deleted';
    } catch (e) {
      if (e.code === '22P02') {
        throw new NotFoundException('Invalid task ID');
      } else if (e.status === 404) {
        throw new NotFoundException(`Task with id: "${id}" not found`);
      }
      throw new InternalServerErrorException();
    }
  }
}
