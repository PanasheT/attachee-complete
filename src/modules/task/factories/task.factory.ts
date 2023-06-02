import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentService } from 'src/modules/student/services';
import { Repository } from 'typeorm';
import { TaskEntity } from '../entities';
import { CreateTaskDto } from './../dtos/create-task.dto';
import { UpdateTaskDto } from './../dtos/update-task.dto';

@Injectable()
export class TaskFactory {
  constructor(
    @InjectRepository(TaskEntity)
    private readonly repo: Repository<TaskEntity>,
    private readonly studentService: StudentService
  ) {}

  public async createTask({
    studentUUID,
    supervisorUUID,
    ...model
  }: CreateTaskDto): Promise<TaskEntity> {
    if (new Date() > model.dueDate) {
      throw new NotAcceptableException('Deadline must be in the future.');
    }

    const student = await this.studentService.findOneStudentOrFail(
      studentUUID,
      'uuid'
    );

    if (!student?.company) {
      throw new BadRequestException(
        'Student is not associated with a company.'
      );
    }

    if (student.company.supervisor.uuid !== supervisorUUID) {
      throw new ForbiddenException(
        'Unassociated Supervisor can not assign task.'
      );
    }

    return Object.assign(new TaskEntity(), {
      ...model,
      student,
      supervisor: student.company.supervisor,
    });
  }

  //TODO: update task
  //there are 2 types of updates, student and supervisor updates
  public async updateTask(
    model: UpdateTaskDto,
    task: TaskEntity,
    supervisorUUID: string
  ): Promise<TaskEntity> {
    if (new Date() > model.dueDate) {
      throw new NotAcceptableException('Deadline must be in the future.');
    }

    if (task.supervisor.uuid !== supervisorUUID) {
      throw new ForbiddenException(
        'Unassociated Supervisor can not assign task.'
      );
    }

    return { ...task, ...model };
  }
}
