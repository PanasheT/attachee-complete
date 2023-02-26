import { AbstractEntity } from 'src/common';
import { StudentEntity } from 'src/modules/student/entities';
import { Column, Entity, OneToMany } from 'typeorm';

@Entity({ name: 'company' })
export class CompanyEntity extends AbstractEntity {
  @Column({ unique: true })
  name: string;

  @Column()
  supervisor: string;

  @Column()
  director: string;

  @Column()
  telephone: string;

  @Column()
  address: string;

  @OneToMany(() => StudentEntity, (student: StudentEntity) => student.company)
  students: StudentEntity[];
}
