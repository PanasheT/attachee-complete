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
import {
  SupervisorDto,
  SupervisorDtoFactory,
} from 'src/modules/supervisor/dtos';
import { SupervisorEntity } from 'src/modules/supervisor/entities';
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
    model: StudentEntity | SupervisorEntity
  ): Promise<
    | StudentLoginResultDto
    | {
        supervisor: SupervisorDto;
        accessToken: string;
        refreshToken: string;
      }
  > {
    const jwtPayload: StudentDto | SupervisorDto =
      model instanceof StudentEntity
        ? StudentDtoFactory(model)
        : SupervisorDtoFactory(model);

    if (!jwtPayload) {
      return;
    }

    const accessToken: string = await this.generateToken(jwtPayload);
    const refreshToken: string = await this.generateToken(jwtPayload, true);

    if (model instanceof StudentEntity) {
      await this.updateStudentRefreshToken(refreshToken, model);
    }

    return model instanceof StudentEntity
      ? {
          student: jwtPayload as StudentDto,
          accessToken,
          refreshToken,
        }
      : {
          supervisor: jwtPayload as SupervisorDto,
          accessToken,
          refreshToken,
        };
  }

  public async generateToken(
    payload: StudentDto | SupervisorDto,
    refreshToken = false
  ): Promise<string> {
    try {
      return await this.jwtService.signAsync(
        { ...payload },
        {
          secret: this.configService.get<string>('TOKEN_SECRET'),
          expiresIn: !!refreshToken
            ? this.configService.get<number>('REFRESH_TOKEN_DURATION')
            : '10d',
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
      await this.studentService.updateStudentRefreshToken(model, refreshToken);
    } catch (error) {
      this.logger.error(error?.message || error);
      throw new InternalServerErrorException('Unexpected auth failure.');
    }
  }
}
