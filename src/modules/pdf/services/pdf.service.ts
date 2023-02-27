import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as html_to_pdf from 'html-pdf-node';
import { ProjectLogEntity } from 'src/modules/project-log/entities';
import { ProjectLogPdfFactory } from '../interfaces/project-log-pdf';

@Injectable()
export class PdfService {
  public async generateProjectLogPdf(model: ProjectLogEntity) {
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
}
