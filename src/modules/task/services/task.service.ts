import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TaskEntity } from '../entities';
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

  public async createTask(model: CreateTaskDto): Promise<TaskEntity> {
    return await this.handleTaskSave(await this.getTaskFromFactory(model))
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
