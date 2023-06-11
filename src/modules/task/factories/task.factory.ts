import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotAcceptableException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { StudentEntity } from 'src/modules/student/entities';
import { StudentService } from 'src/modules/student/services';
import { validateUpdate } from 'src/util';
import { Repository } from 'typeorm';
import { TaskEntity } from '../entities';
import { CreateTaskDto } from './../dtos/create-task.dto';
import {
  UpdateTaskAsStudentDto,
  UpdateTaskDto,
} from './../dtos/update-task.dto';

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

    const student: StudentEntity =
      await this.studentService.findOneStudentOrFail(studentUUID, 'uuid');

    this.validateTaskAssignment(student, supervisorUUID);
    await this.assertStudentTaskIsUnique(model, student.uuid);

    return Object.assign(new TaskEntity(), {
      ...model,
      student,
      supervisor: student.company.supervisor,
    });
  }

  private validateTaskAssignment(
    student: StudentEntity,
    supervisorUUID: string
  ): void {
    if (!student?.company) {
      throw new BadRequestException(
        'Student is not associated with a company.'
      );
    }

    if (!student.company?.supervisor) {
      throw new BadRequestException('Student has not been assigned a company');
    }

    if (student.company.supervisor.uuid !== supervisorUUID) {
      throw new ForbiddenException(
        'Unassociated Supervisor can not assign task.'
      );
    }
  }

  private async assertStudentTaskIsUnique(
    { title, description }: Pick<CreateTaskDto, 'title' | 'description'>,
    studentUUID: string
  ): Promise<void> {
    const query = {
      title,
      description,
      deleted: false,
      student: { uuid: studentUUID, deleted: false },
    };

    if (Boolean(await this.repo.findOneBy(query))) {
      throw new NotAcceptableException(
        'Task with given title and description has already been assigned to student'
      );
    }
  }

  public updateTask(task: TaskEntity, model: UpdateTaskAsStudentDto) {
    const validatedDto = validateUpdate(task, model);
    return { ...task, ...validatedDto };
  }
}
