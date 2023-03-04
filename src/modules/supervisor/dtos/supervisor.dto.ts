import { PickType } from '@nestjs/swagger';
import { SupervisorEntity } from '../entities';

export class SupervisorDto extends PickType(SupervisorEntity, [
  'address',
  'email',
  'firstName',
  'lastName',
  'phone',
  'uuid',
] as const) {}

export function SupervisorDtoFactory(model: SupervisorEntity): SupervisorDto {
  return {
    address: model.address,
    email: model.email,
    firstName: model.firstName,
    lastName: model.lastName,
    phone: model.phone,
    uuid: model.uuid,
  };
}
