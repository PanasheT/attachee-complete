import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { StudentDto, StudentDtoFactory } from 'src/modules/student/dtos';
import { StudentEntity } from 'src/modules/student/entities';
import { StudentService } from 'src/modules/student/services';
import { SupervisorEntity } from 'src/modules/supervisor/entities';
import { SupervisorService } from 'src/modules/supervisor/services';
import { isPasswordCorrect } from 'src/util';
import {
  AdminLoginDto,
  StudentLoginDto,
  UpdateStudentPasswordDto,
} from '../dtos';
import { AuthFactory } from '../factories';
@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private readonly studentService: StudentService,
    private readonly factory: AuthFactory,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly supervisorService: SupervisorService
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

  public async logoutStudent(studentUUID: string): Promise<void> {
    const student: StudentEntity =
      await this.studentService.findOneStudentOrFail(studentUUID, 'uuid');

    await this.invalidateRefreshToken(student);
  }

  private async invalidateRefreshToken(model: StudentEntity): Promise<void> {
    try {
      const student: StudentEntity = Object.assign(model, {
        refreshToken: null,
      });

      await this.studentService.updateStudentRefreshToken(student);
    } catch (error) {
      throw new InternalServerErrorException('Logout operation unhandled.');
    }
  }

  public async verifyStudent(token: string) {
    if (!token) {
      throw new BadRequestException('Invalid token');
    }

    try {
      await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('TOKEN_SECRET'),
      });

      const decodedToken = this.jwtService.decode(token) as StudentDto;

      return await this.studentService.findOneStudentOrFail(
        decodedToken.uuid,
        'uuid'
      );
    } catch (err) {
      this.logger.error(err?.message || err);
      throw new BadRequestException('Token expired');
    }
  }

  public async loginAdmin(model: AdminLoginDto): Promise<any> {
    const supervisor: SupervisorEntity =
      await this.supervisorService.findOneSupervisorOrFail(
        model.email,
        'email'
      );
    await this.comparePasswords(model.password, supervisor.password);
    return await this.factory.generateSuccessfulLoginResult(supervisor);
  }
}
