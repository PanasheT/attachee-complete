import { StudentDto } from 'src/modules/student/dtos';

export class StudentLoginResultDto {
  student: StudentDto;
  token: string;
  refreshToken: string;
}
