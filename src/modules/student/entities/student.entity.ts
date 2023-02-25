import { AbstractEntity } from 'src/common';
import { Entity } from 'typeorm';

@Entity({ name: 'student' })
export class StudentEntity extends AbstractEntity {}
