import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { StudentDto } from 'src/modules/student/dtos';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers.authorization as string;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedException();
    }

    const token: string = authHeader.split(' ').pop();

    if (!token) {
      throw new UnauthorizedException();
    }

    request.student = await this.decodeToken(token);

    return true;
  }

  private async decodeToken(token: string): Promise<StudentDto> {
    try {
      return (await this.jwtService.verifyAsync(token)) as StudentDto;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
