import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as html_to_pdf from 'html-pdf-node';
import * as moment from 'moment';
import { DailyLogEntity } from 'src/modules/daily-log/entities';
import { GoogleDriveService } from 'src/modules/google-drive/services';
import { ProjectLogEntity } from 'src/modules/project-log/entities';
import { ProjectEntity } from 'src/modules/project/entities';
import { StudentEntity } from 'src/modules/student/entities';
import {
  DailyLogPdfFactory,
  ProjectDetailsPdfFactory,
  StudentDetailsPdfFactory,
} from '../interfaces';
import { ProjectLogPdfFactory } from '../interfaces/project-log-pdf';

@Injectable()
export class PdfService {
  constructor(private readonly googleDriveService: GoogleDriveService) {}

  private readonly path: string = 'PDF_LOGS/projects/';

  public async generateProjectLogPdf(model: ProjectLogEntity): Promise<any> {
    const data = ProjectLogPdfFactory(model);

    const template = handlebars.compile(
      fs.readFileSync('src/modules/pdf/templates/project-log.hbs', 'utf8')
    );

    const content = template(data);

    return await html_to_pdf.generatePdf(
      { content },
      { preferCSSPageSize: true, printBackground: true }
    );
  }

  public async saveAndUploadProjectLogToDrive(model: ProjectLogEntity) {
    const buffer = await this.generateProjectLogPdf(model);

    const fileName: string = `Project_Log_${moment(model.logDate).format(
      'DD_MM_YYYY'
    )}`;

    fs.writeFileSync(`${this.path}${fileName}.pdf`, buffer);

    await this.googleDriveService.uploadFile(fileName);
  }

  public async generateDailyLogPdf(model: DailyLogEntity): Promise<any> {
    const template = handlebars.compile(
      fs.readFileSync('src/modules/pdf/templates/daily-log.hbs', 'utf8')
    );

    const content = template(DailyLogPdfFactory(model));

    return await html_to_pdf.generatePdf(
      { content },
      { preferCSSPageSize: true, printBackground: true }
    );
  }

  public async generateProjectDetailsPdf(model: ProjectEntity): Promise<any> {
    const template = handlebars.compile(
      fs.readFileSync('src/modules/pdf/templates/project-details.hbs', 'utf8')
    );

    const content = template(ProjectDetailsPdfFactory(model));

    return await html_to_pdf.generatePdf(
      { content },
      { preferCSSPageSize: true, printBackground: true }
    );
  }

  public async generateStudentDetailsPdf(model: StudentEntity): Promise<any> {
    const template = handlebars.compile(
      fs.readFileSync('src/modules/pdf/templates/student-details.hbs', 'utf8')
    );

    const content = template(StudentDetailsPdfFactory(model));

    return await html_to_pdf.generatePdf(
      { content },
      { preferCSSPageSize: true, printBackground: true }
    );
  }
}
