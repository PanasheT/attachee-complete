import {
  BadRequestException,
  Body,
  Controller,
  Get,
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

  @Get(':uuid')
  @ApiOperation({ summary: 'Find supervisor by uuid' })
  public async findOneSupervisor(
    @Param('uuid') uuid: string
  ): Promise<SupervisorDto> {
    const supervisor: SupervisorEntity =
      await this.service.findOneSupervisorOrFail(uuid, 'uuid');
    return SupervisorDtoFactory(supervisor);
  }

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
