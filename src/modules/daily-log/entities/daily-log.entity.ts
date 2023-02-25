import { AbstractEntity } from 'src/common';
import { Entity } from 'typeorm';

@Entity({ name: 'daily-log' })
export class DailyLogEntity extends AbstractEntity {}
