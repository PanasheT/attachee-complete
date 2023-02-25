import { Entity } from 'typeorm';
import { AbstractEntity } from 'src/common';


@Entity({ name: 'project' })
export class ProjectEntity extends AbstractEntity {}
