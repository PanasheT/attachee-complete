import { Injectable, UnauthorizedException } from '@nestjs/common';
import { StudentEntity } from 'src/modules/student/entities';
import { StudentService } from 'src/modules/student/services';
import { isPasswordCorrect } from 'src/util';
import { StudentLoginDto } from '../dtos';
import { AuthFactory } from '../factories';

@Injectable()
export class AuthService {
  constructor(
    private readonly studentService: StudentService,
    private readonly factory: AuthFactory
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
    if (!isPasswordCorrect(password, hashedPassword)) {
      throw new UnauthorizedException('Invalid credentials.');
    }
  }
}
