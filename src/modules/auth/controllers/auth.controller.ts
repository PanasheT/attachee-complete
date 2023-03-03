import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotAcceptableException,
  Post,
} from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  StudentLoginDto,
  StudentLoginResultDto,
  UpdateStudentPasswordDto,
} from '../dtos';
import { AuthService } from '../services';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post()
  @ApiOperation({ summary: 'Login a student.' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Student successfully logged in.',
    type: StudentLoginResultDto,
  })
  public async loginStudent(
    @Body() model: StudentLoginDto
  ): Promise<StudentLoginResultDto> {
    return this.service.loginStudent(model);
  }

  @Post('password-update')
  @ApiOperation({ summary: 'Update a specific students password.' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Student password update successfully',
  })
  public async updateStudentPassword(
    @Body() model: UpdateStudentPasswordDto
  ): Promise<void> {
    if (model.newPassword === model.oldPassword) {
      throw new NotAcceptableException('Old password matches new password.');
    }

    await this.service.updateStudentPassword(model);
  }
}
