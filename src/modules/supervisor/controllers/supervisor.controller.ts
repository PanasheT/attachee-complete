import {
  BadRequestException,
  Body,
  Controller,
  Param,
  Patch,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { isUUID } from 'class-validator';
import { SupervisorEntity } from 'src/modules/supervisor/entities';
import {
  SupervisorDto,
  SupervisorDtoFactory,
  UpdateSupervisorDto,
} from '../dtos';
import { SupervisorService } from '../services';

@Controller('supervisors')
@ApiTags('supervisors')
export class SupervisorController {
  constructor(private readonly service: SupervisorService) {}

  @Patch(':uuid')
  @ApiOperation({ summary: 'Update a supervisor by uuid' })
  public async updateSupervisor(
    @Param('uuid') uuid: string,
    @Body() model: UpdateSupervisorDto
  ): Promise<SupervisorDto> {
    if (!isUUID(uuid)) {
      throw new BadRequestException('Invalid uuid');
    }

    const supervisor: SupervisorEntity = await this.service.updateSupervisor(
      model,
      uuid
    );
    return SupervisorDtoFactory(supervisor);
  }
}
