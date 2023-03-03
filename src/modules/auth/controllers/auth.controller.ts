import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  NotAcceptableException,
  Param,
  Post,
  Put,
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

  @Post('token/:studentUUID')
  @ApiOperation({ summary: 'Refresh a students token.' })
  @HttpCode(HttpStatus.OK)
  @ApiOkResponse({
    description: 'Token refresh successful',
    type: String,
  })
  public async refreshToken(
    @Param('studentUUID') studentUUID: string,
    @Body() model: { refreshToken: string }
  ): Promise<string> {
    return await this.service.refreshToken(studentUUID, model.refreshToken);
  }

  @Put('logout/:studentUUID')
  @ApiOperation({ summary: 'Logout a student.' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiNoContentResponse({
    description: 'Student logout successful.',
  })
  public async logoutStudent(
    @Param('studentUUID') studentUUID: string
  ): Promise<void> {
    await this.service.logoutStudent(studentUUID);
  }
}
