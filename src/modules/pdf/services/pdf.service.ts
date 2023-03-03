import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
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
import { PdfType, PdfUtility } from '../types';

const PdfFactory: Record<PdfType, PdfUtility> = {
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

@Injectable()
export class PdfService {
  private logger = new Logger(PdfService.name);

  protected readonly localLogStoragePath: string = 'PDF_LOGS/projects/';

  constructor(private readonly googleDriveService: GoogleDriveService) {}

  public async saveAndUploadProjectLogToDrive(model: ProjectLogEntity) {
    const buffer = await this.generatePdfByType(model, 'projectLog');

    const fileName = `Project_Log_${moment(model.logDate).format(
      'DD_MM_YYYY'
    )}`;

    await fs.promises.writeFile(
      `${this.localLogStoragePath}${fileName}.pdf`,
      buffer
    );

    await this.googleDriveService.uploadFile(fileName);
  }

  public async generatePdfByType(
    model: StudentEntity,
    key: 'studentDetails'
  ): Promise<Buffer>;
  public async generatePdfByType(
    model: DailyLogEntity,
    key: 'dailyLog'
  ): Promise<Buffer>;
  public async generatePdfByType(
    model: ProjectLogEntity,
    key: 'projectLog'
  ): Promise<Buffer>;
  public async generatePdfByType(
    model: ProjectEntity,
    key: 'projectDetails'
  ): Promise<Buffer>;
  public async generatePdfByType<T>(model: T, key: PdfType): Promise<Buffer> {
    try {
      const { templatePath, factory } = PdfFactory[key];

      const template = handlebars.compile(
        await fs.promises.readFile(templatePath, 'utf8')
      );

      const content = template(factory(model));

      return await html_to_pdf.generatePdf(
        { content },
        { preferCSSPageSize: true, printBackground: true }
      );
    } catch (error) {
      this.logger.error(error?.message || error);
      throw new InternalServerErrorException('Failed to create PDF.');
    }
  }
}
