import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../auth/auth.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { Task } from './task.entity';
import { TasksService } from './tasks.service';

const mockUser: User = {
  id: 'myTestId',
  username: 'ammar_alkhooly',
  password: 'testPassword',
  tasks: [],
};

const tasks: Task[] = [];

const mockTaskRepository = () => ({
  createQueryBuilder: jest.fn(() => ({
    where: jest.fn().mockReturnThis(),
    andWhere: jest.fn().mockReturnThis(),
    getMany: jest.fn().mockReturnThis().mockResolvedValue(tasks),
  })),
  create: jest.fn(),
  delete: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
});

const TASK_REPOSITORY_TOKEN = getRepositoryToken(Task);

describe('Task Service', () => {
  let taskService: TasksService;
  let taskRepository;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: TASK_REPOSITORY_TOKEN,
          useFactory: mockTaskRepository,
        },
      ],
    }).compile();

    taskService = module.get<TasksService>(TasksService);
    taskRepository = module.get<Repository<Task>>(TASK_REPOSITORY_TOKEN);
  });

  it('Task service should be defined', () => {
    expect(taskService).toBeDefined();
  });

  it('Task Repository should be defined', () => {
    expect(taskRepository).toBeDefined();
  });

  describe('Create Task', () => {
    it('TaskService.createTask() should create a new task and return the new task', async () => {
      const createTaskDto: CreateTaskDto = {
        title: 'new Test Task Title',
        description: 'new Test task description',
      };
      const newTask: Task = {
        id: 'mySecondTestId',
        status: TaskStatus.OPEN,
        user: mockUser,
        ...createTaskDto,
      };
      taskRepository.create.mockResolvedValue({
        id: 'mySecondTestId',
        status: TaskStatus.OPEN,
        user: mockUser,
        ...createTaskDto,
      });
      const result = await taskService.createTask(createTaskDto, mockUser);
      tasks.push(result);
      expect(JSON.stringify(result)).toEqual(JSON.stringify(newTask));
    });

    describe('GetTasks', () => {
      it('TaskService.getTasks() should return 1 task in the tasks array after creating a new task', async () => {
        const result = await taskService.getTasks({}, mockUser);
        expect(result.length).toEqual(1);
      });

      it('TaskService.getTasks() should return an array of a task(s)', async () => {
        const result = await taskService.getTasks({}, mockUser);
        expect(result).toEqual(tasks);
      });
    });

    describe('Get Task By ID', () => {
      it('TaskService.getTaskById() should return a single task given a valid taskId', async () => {
        taskRepository.findOne.mockResolvedValue(tasks[0]);
        const result = await taskService.getTaskById(tasks[0].id, mockUser);
        expect(result).toEqual(tasks[0]);
      });

      it('TaskService.getTaskById() should return a NotFoundException given an invalid taskId', () => {
        taskRepository.findOne.mockResolvedValue(null);
        const result = taskService.getTaskById('someRandomId', mockUser);
        expect(result).rejects.toThrow(NotFoundException);
      });
    });

    describe('Update Task', () => {
      it('TaskService.updateStatus() should update the task status and return a the updated task, only if given a valid taskId', async () => {
        taskRepository.findOne.mockResolvedValue(tasks[0]);
        const result = await taskService.updateStatus(
          tasks[0].id,
          {
            status: TaskStatus.DONE,
          },
          mockUser,
        );
        expect(result.status).toEqual(TaskStatus.DONE);
      });
    });

    describe('Delete Task', () => {
      it('TaskService.deleteTask() should delete a task and result in a 200 status code', async () => {
        taskRepository.delete.mockResolvedValue({ affected: 1 });
        const result = taskService.deleteTask(tasks[0].id, mockUser);
        expect(result).resolves.toBe('Task deleted');
      });

      it('TaskService.deleteTask() should return a NotFoundException given an invalid taskId', () => {
        taskRepository.delete.mockResolvedValue({ affected: 0 });
        const result = taskService.deleteTask('someRandomId', mockUser);
        expect(result).rejects.toThrow(NotFoundException);
      });
    });
  });
});
