import { PickType } from '@nestjs/swagger';
import { CreateStudentDto } from './create-student.dto';

export class UpdateStudentDto extends PickType(CreateStudentDto, [
  'email',
  'phone',
  'programmeCode',
  'yearOfStudy',
] as const) {}
