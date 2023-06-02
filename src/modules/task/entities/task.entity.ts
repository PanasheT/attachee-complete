import { AbstractEntity } from 'src/common';
import { Entity } from 'typeorm';

@Entity({ name: 'task' })
export class TaskEntity extends AbstractEntity {}
