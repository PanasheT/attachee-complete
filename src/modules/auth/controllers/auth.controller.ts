import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotAcceptableException,
  Post,
  Put,
  Response,
} from '@nestjs/common';
import {
  ApiNoContentResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
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

  @Post('token')
  @ApiOperation({ summary: 'Refresh a students token.' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Token refresh successful.',
    type: String,
  })
  public async refreshToken(@Response() res: any): Promise<string> {
    const refreshToken = res.body.refreshToken as string;
    const studentUUID = res.body.user.uuid as string;

    if (!refreshToken || !studentUUID) {
      throw new BadRequestException();
    }

    return await this.service.refreshToken(studentUUID, refreshToken);
  }

  @Put('logout')
  @ApiOperation({ summary: 'Logout a student.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'Student logout successful.',
  })
  public async logoutStudent(@Response() res: any): Promise<void> {
    const { uuid } = res.body?.user;

    if (!uuid || typeof uuid !== 'string') {
      throw new BadRequestException();
    }

    await this.service.logoutStudent(uuid);
  }
}
