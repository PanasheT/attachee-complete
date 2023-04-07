import {
  BadRequestException,
  Body,
  Controller,
  NotAcceptableException,
  Post,
  Put,
  Res,
  Response,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { isUUID } from 'class-validator';
import { Public } from 'src/decorators';
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

  @Public()
  @Post('login')
  @ApiOperation({ summary: 'Login a student.' })
  public async loginStudent(
    @Body() model: StudentLoginDto
  ): Promise<StudentLoginResultDto> {
    return this.service.loginStudent(model);
  }

  @Put('reset')
  @ApiOperation({ summary: 'Update a students password.' })
  public async updateStudentPassword(
    @Body() model: UpdateStudentPasswordDto
  ): Promise<void> {
    if (model.newPassword === model.oldPassword) {
      throw new NotAcceptableException('Old password matches new password.');
    }

    await this.service.updateStudentPassword(model);
  }

  @Post('refresh')
  @ApiOperation({ summary: 'Refresh a students token.' })
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
  public async logoutStudent(@Res() res: any): Promise<void> {
    const { uuid } = res.body?.user;

    if (!uuid || !isUUID(uuid)) {
      throw new BadRequestException();
    }

    await this.service.logoutStudent(uuid);
  }
}
