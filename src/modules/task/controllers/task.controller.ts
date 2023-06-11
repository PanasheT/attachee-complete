import { Body, Controller, Get, Param, Patch, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CreateTaskDto,
  TaskDto,
  TaskDtoFactory,
  UpdateTaskAsStudentDto,
} from '../dtos';
import { TaskEntity } from '../entities';
import { TaskService } from '../services';
import { TaskStudentSupervisorType } from '../types/task.types';

@Controller('tasks')
@ApiTags('tasks')
export class TaskController {
  constructor(private readonly service: TaskService) {}

  @Get()
  @ApiOperation({ summary: 'Find all tasks' })
  public async findAllTasks(): Promise<TaskDto[]> {
    return (await this.service.findAllTasks()).map(TaskDtoFactory);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  public async createTask(@Body() model: CreateTaskDto): Promise<TaskDto> {
    return TaskDtoFactory(await this.service.createTask(model));
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Find a task by uuid' })
  public async findOneTaskOrFail(
    @Param('uuid') uuid: string
  ): Promise<TaskDto> {
    return TaskDtoFactory(await this.service.findOneTaskOrFail(uuid));
  }

  @Get('/creator/:uuid/:key')
  @ApiOperation({ summary: 'Find all tasks by student or supervisor uuid ' })
  public async findAllStudentOrSupevisorsTasks(
    @Param('uuid') uuid: string,
    @Param('key') key: TaskStudentSupervisorType
  ): Promise<TaskDto[]> {
    return (await this.service.findAllStudentOrSupevisorsTasks(uuid, key)).map(
      TaskDtoFactory
    );
  }

  @Patch(':uuid/student/:studentUUID')
  @ApiOperation({ summary: 'Update a task as a student' })
  public async updateTaskAsStudent(
    @Param('uuid') uuid: string,
    @Param('studentUUID') studentUUID: string,
    @Body() model: UpdateTaskAsStudentDto
  ): Promise<TaskDto> {
    const task: TaskEntity = await this.service.updateTaskAsStudent(
      uuid,
      studentUUID,
      model
    );
    return TaskDtoFactory(task);
  }
}
