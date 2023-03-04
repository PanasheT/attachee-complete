import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { StudentDto, StudentDtoFactory } from 'src/modules/student/dtos';
import { StudentEntity } from 'src/modules/student/entities';
import { StudentService } from 'src/modules/student/services';
import { StudentLoginResultDto } from '../dtos';

@Injectable()
export class AuthFactory {
  private logger = new Logger(AuthFactory.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly studentService: StudentService
  ) {}

  public async generateSuccessfulLoginResult(
    model: StudentEntity
  ): Promise<StudentLoginResultDto> {
    const payload: StudentDto = StudentDtoFactory(model);

    if (!payload) {
      return;
    }

    const accessToken: string = await this.generateToken(payload);
    const refreshToken: string = await this.generateToken(payload, true);

    await this.updateStudentRefreshToken(refreshToken, model);

    return Object.assign(new StudentLoginResultDto(), {
      student: payload,
      accessToken,
      refreshToken,
    });
  }

  public async generateToken(
    payload: StudentDto,
    refreshToken = false
  ): Promise<string> {
    try {
      return await this.jwtService.signAsync(
        { ...payload },
        {
          secret: this.configService.get<string>('TOKEN_SECRET'),
          expiresIn: !!refreshToken
            ? '7d'
            : this.configService.get<number>('TOKEN_DURATION'),
        }
      );
    } catch (error) {
      this.logger.error(error?.message || error);
      throw new InternalServerErrorException('Unexpected auth failure.');
    }
  }

  private async updateStudentRefreshToken(
    refreshToken: string,
    model: StudentEntity
  ): Promise<void> {
    try {
      const student: StudentEntity = Object.assign(model, { refreshToken });
      await this.studentService.studentUpdateFromAuth(student);
    } catch (error) {
      this.logger.error(error?.message || error);
      throw new InternalServerErrorException('Unexpected auth failure.');
    }
  }
}
