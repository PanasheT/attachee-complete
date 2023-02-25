import { PickType } from '@nestjs/swagger';
import { StudentEntity } from '../entities';

export class StudentDto extends PickType(StudentEntity, [
  'email',
  'firstName',
  'lastName',
  'phone',
  'programmeCode',
  'regNumber',
  'university',
  'uuid',
  'yearOfStudy',
] as const) {}

export function StudentDtoFactory(model: StudentEntity): StudentDto {
  return {
    email: model.email,
    firstName: model.firstName,
    lastName: model.lastName,
    phone: model.phone,
    programmeCode: model.programmeCode,
    regNumber: model.regNumber,
    university: model.university,
    uuid: model.uuid,
    yearOfStudy: model.yearOfStudy,
  };
}
