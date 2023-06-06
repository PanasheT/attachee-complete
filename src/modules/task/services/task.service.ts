import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotAcceptableException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from '../entities';
import { TaskStudentSupervisorType } from '../types/task.types';
import { CreateTaskDto } from './../dtos/create-task.dto';
import { TaskFactory } from './../factories';

@Injectable()
export class TaskService {
  private logger = new Logger(TaskService.name);

  constructor(
    @InjectRepository(TaskEntity)
    private readonly repo: Repository<TaskEntity>,
    private readonly factory: TaskFactory
  ) {}

  public async findAllTasks(): Promise<TaskEntity[]> {
    return await this.repo.findBy({ deleted: false });
  }

  public async findOneTaskOrFail(uuid: string): Promise<TaskEntity> {
    try {
      return await this.repo.findOneByOrFail({ deleted: false, uuid });
    } catch {
      throw new NotFoundException('Task not found');
    }
  }

  public async findAllStudentOrSupevisorsTasks(
    uuid: string,
    key: TaskStudentSupervisorType
  ): Promise<TaskEntity[]> {
    if (key !== 'student' && key !== 'supervisor') {
      throw new NotAcceptableException("Invalid query key")
    }

    const query = { [key]: { uuid, deleted: false }, deleted: false };
    return await this.repo.findBy(query);
  }

  public async createTask(model: CreateTaskDto): Promise<TaskEntity> {
    return await this.handleTaskSave(await this.getTaskFromFactory(model));
  }

  private async getTaskFromFactory(model: CreateTaskDto): Promise<TaskEntity> {
    try {
      return this.factory.createTask(model);
    } catch (error) {
      throw new HttpException(error?.message, error?.status);
    }
  }

  private async handleTaskSave(model: TaskEntity): Promise<TaskEntity> {
    try {
      return await this.repo.save(model);
    } catch (error) {
      this.logger.error(error?.message || error);
      throw new InternalServerErrorException('Failed to create task');
    }
  }
}
