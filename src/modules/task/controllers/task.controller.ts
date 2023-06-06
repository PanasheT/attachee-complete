import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { CreateTaskDto } from '../dtos';
import { TaskDto, TaskDtoFactory } from '../dtos/task.dto';
import { TaskService } from '../services';

@Controller('tasks')
@ApiTags('tasks')
export class TaskController {
  constructor(private readonly service: TaskService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new task' })
  public async createTask(@Body() model: CreateTaskDto): Promise<TaskDto> {
    return TaskDtoFactory(await this.service.createTask(model));
  }
}
