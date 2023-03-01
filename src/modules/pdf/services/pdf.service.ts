import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as html_to_pdf from 'html-pdf-node';
import * as moment from 'moment';
import { GoogleDriveService } from 'src/modules/google-drive/services';
import { ProjectLogEntity } from 'src/modules/project-log/entities';
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
}
