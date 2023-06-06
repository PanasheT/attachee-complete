import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTaskDto } from '../dtos';
import { TaskDto, TaskDtoFactory } from '../dtos/task.dto';
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
}
