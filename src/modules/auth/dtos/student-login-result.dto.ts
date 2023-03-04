import { StudentDto } from 'src/modules/student/dtos';

export class StudentLoginResultDto {
  student: StudentDto;
  accessToken: string;
  refreshToken: string;
}
