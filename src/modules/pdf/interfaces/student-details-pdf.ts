import { StudentEntity } from 'src/modules/student/entities';

export interface StudentDetailsPdf {
  name: string;
  regNumber: string;
  programmeCode: string;
  university: string;
  email: string;
  yearOfStudy: number;
  companyName: string;
  director: string;
  supervisor: string;
  telephone: string;
  address: string;
}

export function StudentDetailsPdfFactory(
  model: StudentEntity
): StudentDetailsPdf {
  return {
    name: model.firstName.trim() + ' ' + model.lastName,
    regNumber: model.regNumber,
    programmeCode: model.programmeCode,
    university: model.university,
    email: model.email,
    yearOfStudy: model.yearOfStudy,
    companyName: model.company.name,
    director: model.company.director,
    supervisor: model.company.supervisor,
    telephone: model.company.telephone,
    address: model.company.address,
  };
}
