import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { StudentDto, StudentDtoFactory } from 'src/modules/student/dtos';
import { StudentEntity } from 'src/modules/student/entities';
import { StudentLoginResultDto } from '../dtos';

@Injectable()
export class AuthFactory {
  private logger = new Logger(AuthFactory.name);

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  public async generateSuccessfulLoginResult(
    model: StudentEntity
  ): Promise<StudentLoginResultDto> {
    const payload: StudentDto = StudentDtoFactory(model);

    if (!payload) {
      return;
    }

    const token: string = await this.generateToken(payload);

    return Object.assign(new StudentLoginResultDto(), {
      student: payload,
      token,
    });
  }

  private async generateToken(payload: StudentDto): Promise<string> {
    try {
      return await this.jwtService.signAsync(
        { ...payload },
        {
          secret: this.configService.get<string>('TOKEN_SECRET'),
          expiresIn: this.configService.get<number>('TOKEN_DURATION'),
        }
      );
    } catch (error) {
      this.logger.error(error?.message || error);
      throw new InternalServerErrorException('Unable to generate token.');
    }
  }
}
