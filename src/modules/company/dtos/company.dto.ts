import { PickType } from '@nestjs/mapped-types';
import { CompanyEntity } from '../entities';

export class CompanyDto extends PickType(CompanyEntity, [
  'address',
  'director',
  'name',
  'supervisor',
  'telephone',
  'uuid',
] as const) {}

export function CompanyDtoFactory(model: CompanyEntity): CompanyDto {
  return {
    address: model.address,
    director: model.director,
    name: model.name,
    supervisor: model.supervisor,
    telephone: model.telephone,
    uuid: model.uuid,
  };
}
