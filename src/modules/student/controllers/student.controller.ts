import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { CreateStudentDto, StudentDto, StudentDtoFactory } from '../dtos';
import { StudentService } from '../services';

@Controller('students')
@ApiTags('students')
export class StudentController {
  constructor(private readonly service: StudentService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new student.' })
  @HttpCode(HttpStatus.CREATED)
  @ApiCreatedResponse({
    description: 'The student has been successfully created.',
    type: StudentDto,
  })
  public async createNewStudent(
    @Body() model: CreateStudentDto
  ): Promise<StudentDto> {
    const student = await this.service.createStudent(model);
    return StudentDtoFactory(student);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all students.' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Students successfully retrieved.',
    type: [StudentDto],
  })
  public async findAllStudents(): Promise<StudentDto[]> {
    const students = await this.service.findAllStudents();
    return students.map(StudentDtoFactory);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Retrieve a specific student by uuid.' })
  @HttpCode(HttpStatus.FOUND)
  @ApiOkResponse({
    description: 'Student successfully retrieved.',
    type: StudentDto,
  })
  public async findOneStudent(
    @Param('uuid') uuid: string
  ): Promise<StudentDto> {
    const student = await this.service.findOneStudentOrFail(uuid, 'uuid');
    return StudentDtoFactory(student);
  }
}
