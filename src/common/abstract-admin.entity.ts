import { Column } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

export abstract class AbstractAdminEntity extends AbstractEntity {
  @Column({ unique: true })
  email: string;

  @Column({ unique: true })
  phone: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  address: string;
}
