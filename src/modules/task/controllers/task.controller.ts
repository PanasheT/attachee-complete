import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { TaskService } from '../services';

@Controller('tasks')
@ApiTags('tasks')
export class TaskController {
  constructor(private readonly service: TaskService) {}
}
