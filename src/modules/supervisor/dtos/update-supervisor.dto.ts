import { PartialType, PickType } from '@nestjs/mapped-types';
import { CreateSupervisorDto } from './create-supervisor.dto';

export class UpdateSupervisorDto extends PartialType(
  PickType(CreateSupervisorDto, ['address', 'email', 'phone'] as const)
) {}
