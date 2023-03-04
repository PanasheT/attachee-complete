import { AbstractAdminEntity } from 'src/common';
import { CompanyEntity } from 'src/modules/company/entities';
import { Entity, JoinColumn, OneToOne } from 'typeorm';

@Entity({ name: 'supervisor' })
export class SupervisorEntity extends AbstractAdminEntity {
  @OneToOne(() => CompanyEntity, (company: CompanyEntity) => company.supervisor)
  @JoinColumn()
  company: CompanyEntity;
}
