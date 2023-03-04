import { AbstractAdminEntity } from 'src/common';
import { Entity } from 'typeorm';

@Entity({ name: 'supervisor' })
export class SupervisorEntity extends AbstractAdminEntity {}
