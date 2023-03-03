import {
  ForbiddenException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { StudentDto, StudentDtoFactory } from 'src/modules/student/dtos';
import { StudentEntity } from 'src/modules/student/entities';
import { StudentService } from 'src/modules/student/services';
import { isPasswordCorrect } from 'src/util';
import { StudentLoginDto, UpdateStudentPasswordDto } from '../dtos';
import { AuthFactory } from '../factories';
@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private readonly studentService: StudentService,
    private readonly factory: AuthFactory,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  public async loginStudent({ regNumber, password }: StudentLoginDto) {
    const student: StudentEntity =
      await this.studentService.findOneStudentOrFail(regNumber, 'regNumber');

    await this.comparePasswords(password, student.password);

    return this.factory.generateSuccessfulLoginResult(student);
  }

  private async comparePasswords(
    password: string,
    hashedPassword: string
  ): Promise<void> {
    if (!(await isPasswordCorrect(password, hashedPassword))) {
      throw new UnauthorizedException('Invalid credentials.');
    }
  }

  public async updateStudentPassword({
    newPassword,
    oldPassword,
    studentUUID,
  }: UpdateStudentPasswordDto): Promise<void> {
    const student: StudentEntity =
      await this.studentService.findOneStudentOrFail(studentUUID, 'uuid');

    await this.comparePasswords(oldPassword, student.password);

    await this.studentService.updateStudentPassword(student, newPassword);
  }

  public async refreshToken(
    studentUUID: string,
    refreshToken: string
  ): Promise<string> {
    const student: StudentEntity =
      await this.studentService.findOneStudentOrFail(studentUUID, 'uuid');

    await this.verifyRefreshToken(studentUUID, refreshToken);

    const payload: StudentDto = StudentDtoFactory(student);

    return await this.factory.generateToken(payload);
  }

  private async verifyRefreshToken(studentUUID: string, refreshToken: string) {
    try {
      const payload = (await this.jwtService.verifyAsync(refreshToken, {
        secret: this.configService.get<string>('TOKEN_SECRET'),
        ignoreExpiration: false,
      })) as StudentDto;

      if (studentUUID !== payload.uuid) {
        throw new ForbiddenException();
      }
    } catch (error) {
      this.logger.error(error?.message || error);
      throw new ForbiddenException();
    }
  }
}
