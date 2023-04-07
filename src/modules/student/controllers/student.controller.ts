import { Body, Controller, Get, Param, Post, Put, Res } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
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
  public async createNewStudent(
    @Body() model: CreateStudentDto
  ): Promise<StudentDto> {
    const student = await this.service.createStudent(model);
    return StudentDtoFactory(student);
  }

  @Get()
  @ApiOperation({ summary: 'Retrieve all students.' })
  public async findAllStudents(): Promise<StudentDto[]> {
    const students = await this.service.findAllStudents();
    return students.map(StudentDtoFactory);
  }

  @Get(':uuid')
  @ApiOperation({ summary: 'Retrieve a specific student by uuid.' })
  public async findOneStudent(
    @Param('uuid') uuid: string
  ): Promise<StudentDto> {
    const student = await this.service.findOneStudentOrFail(uuid, 'uuid');
    return StudentDtoFactory(student);
  }

  @Put(':uuid')
  @ApiOperation({ summary: 'Update a specific student by uuid.' })
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

    if (!buffer) {
      return null;
    }

    const stream = new Readable();
    stream.push(buffer);
    stream.push(null);

    response.set({
      'Content-Type': 'application/pdf',
      'Content-Length': buffer.length,
      'Content-Disposition': `attachment; filename="student_details_${student.regNumber}"`,
    });

    return stream.pipe(response);
  }
}
