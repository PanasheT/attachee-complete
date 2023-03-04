import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { PUBLIC_ROUTE_KEY } from 'src/decorators';
import { StudentDto } from 'src/modules/student/dtos';

@Injectable()
export class JwtGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly reflector: Reflector
  ) {}

  public async canActivate(context: ExecutionContext): Promise<boolean> {
    if (this.assertRouteIsPublic(context)) {
      return true;
    }

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

  private assertRouteIsPublic(context: ExecutionContext): boolean {
    return this.reflector.getAllAndOverride<boolean>(PUBLIC_ROUTE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
  }

  private async decodeToken(token: string): Promise<StudentDto> {
    try {
      return (await this.jwtService.verifyAsync(token)) as StudentDto;
    } catch (error) {
      throw new UnauthorizedException();
    }
  }
}
