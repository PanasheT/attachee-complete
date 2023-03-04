import {
  DailyLogPdfFactory,
  ProjectDetailsPdfFactory,
  ProjectLogPdfFactory,
  StudentDetailsPdfFactory,
} from '../interfaces';
import { PdfType, PdfUtility } from '../types';

export const PdfFactory: Record<PdfType, PdfUtility> = {
  studentDetails: {
    templatePath: 'src/modules/pdf/templates/student-details.hbs',
    factory: StudentDetailsPdfFactory,
  },
  dailyLog: {
    templatePath: 'src/modules/pdf/templates/daily-log.hbs',
    factory: DailyLogPdfFactory,
  },
  projectLog: {
    templatePath: 'src/modules/pdf/templates/project-log.hbs',
    factory: ProjectLogPdfFactory,
  },
  projectDetails: {
    templatePath: 'src/modules/pdf/templates/project-details.hbs',
    factory: ProjectDetailsPdfFactory,
  },
};
