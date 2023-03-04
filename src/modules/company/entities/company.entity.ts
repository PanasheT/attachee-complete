import { AbstractEntity } from 'src/common';
import { StudentEntity } from 'src/modules/student/entities';
import { SupervisorEntity } from 'src/modules/supervisor/entities';
import { Column, Entity, OneToMany, OneToOne } from 'typeorm';

@Entity({ name: 'company' })
export class CompanyEntity extends AbstractEntity {
  @Column({ unique: true })
  name: string;

  @Column()
  director: string;

  @Column()
  telephone: string;

  @Column()
  address: string;

  @OneToMany(() => StudentEntity, (student: StudentEntity) => student.company)
  students: StudentEntity[];

  @OneToOne(
    () => SupervisorEntity,
    (supervisor: SupervisorEntity) => supervisor.company,
    { cascade: true, eager: true, onDelete: 'CASCADE' }
  )
  supervisor: SupervisorEntity;
}
