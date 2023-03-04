import {
  Body,
  Controller,
  Get,
  Header,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Response } from 'express';
import { Public } from 'src/decorators';
import { PdfService } from 'src/modules/pdf/services';
import { Readable } from 'stream';
import {
  CreateStudentDto,
  StudentDto,
  StudentDtoFactory,
  UpdateStudentDto,
} from '../dtos';
import { StudentEntity } from '../entities';
import { StudentService } from '../services';

@Controller('students')
@ApiTags('students')
export class StudentController {
  constructor(
    private readonly service: StudentService,
    private readonly pdfService: PdfService
  ) {}

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

  @Public()
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
  @ApiFoundResponse({
    description: 'Student successfully retrieved.',
    type: StudentDto,
  })
  public async findOneStudent(
    @Param('uuid') uuid: string
  ): Promise<StudentDto> {
    const student = await this.service.findOneStudentOrFail(uuid, 'uuid');
    return StudentDtoFactory(student);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Update a specific student by uuid.' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Student updated successfully.',
    type: StudentDto,
  })
  public async updateStudent(
    @Param('uuid') uuid: string,
    @Body() model: UpdateStudentDto
  ): Promise<StudentDto> {
    const student = await this.service.updateStudent(uuid, model);
    return StudentDtoFactory(student);
  }

  @Get(':uuid/summary')
  @ApiOperation({
    summary: 'Get a pdf summarising the details of a specific stuednt by uuid.',
  })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Student details pdf successfully created.',
  })
  @Header('content-type', 'application/pdf')
  public async getStudentDetailsPdf(
    @Param('uuid') uuid: string,
    @Res() response: Response
  ) {
    const student: StudentEntity = await this.service.findOneStudentOrFail(
      uuid,
      'uuid'
    );

    const buffer = await this.pdfService.generatePdfByType(
      student,
      'studentDetails'
    );

    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    response.set({
      'Content-Type': 'application/pdf',
      'Content-Length': buffer.length,
    });

    return stream.pipe(response);
  }
}
