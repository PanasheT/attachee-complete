import { PickType } from '@nestjs/swagger';
import { StudentEntity } from '../entities';
import {
  CompanyDto,
  CompanyDtoFactory,
} from './../../company/dtos/company.dto';

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
] as const) {
  company: CompanyDto;
}

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
    company: !!model?.company ? CompanyDtoFactory(model.company) : null,
  };
}
