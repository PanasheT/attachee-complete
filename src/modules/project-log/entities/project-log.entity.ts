import { AbstractEntity } from 'src/common';
import { Entity } from 'typeorm';

@Entity({ name: 'project-log' })
export class ProjectLogEntity extends AbstractEntity {}
