import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { StudentService } from '../services';

@Controller('students')
@ApiTags('students')
export class StudentController {
  constructor(private readonly service: StudentService) {}
}
