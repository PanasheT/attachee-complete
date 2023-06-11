import { PickType } from '@nestjs/mapped-types';
import { StudentDto, StudentDtoFactory } from 'src/modules/student/dtos';
import { DailyLogEntity } from '../entities';

export class DailyLogDto extends PickType(DailyLogEntity, [
  'checkIn',
  'checkOut',
  'comment',
  'description',
  'difficulties',
  'uuid',
  'fileId',
  'isVerified'
] as const) {
  student: StudentDto;
}

export function DailyLogDtoFactory(model: DailyLogEntity): DailyLogDto {
  return {
    checkIn: model.checkIn,
    checkOut: model.checkOut,
    comment: model.comment,
    description: model.description,
    difficulties: model.difficulties,
    uuid: model.uuid,
    student: StudentDtoFactory(model.student),
    fileId: model?.fileId || null,
    isVerified: model.isVerified
  };
}
