import { FindQuery } from 'src/common';
import { StudentEntity } from '../entities';

export type StudentIdentificationProperties =
  | 'regNumber'
  | 'uuid'
  | 'phone'
  | 'email';

export type FindStudentQuery = FindQuery<
  StudentEntity,
  StudentIdentificationProperties
>;
