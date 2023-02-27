import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StudentLoginDto, StudentLoginResultDto } from '../dtos';
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
}
