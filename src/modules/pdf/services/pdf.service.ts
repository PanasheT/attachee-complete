import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as html_to_pdf from 'html-pdf-node';
import { AbstractEntity } from 'src/common';
import { DailyLogEntity } from 'src/modules/daily-log/entities';
import { GoogleDriveService } from 'src/modules/google-drive/services';
import { ProjectLogEntity } from 'src/modules/project-log/entities';
import { ProjectEntity } from 'src/modules/project/entities';
import { StudentEntity } from 'src/modules/student/entities';
import {
  DailyLogPdfFactory,
  ProjectDetailsPdfFactory,
  ProjectLogPdfFactory,
  StudentDetailsPdfFactory,
} from '../interfaces';
import { PdfType, PdfUtility } from '../types';

@Injectable()
export class PdfService {
  private logger = new Logger(PdfService.name);

  public static readonly PdfFactory: Record<PdfType, PdfUtility> = {
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

  protected readonly localLogStoragePath: string = 'PDF_LOGS/projects/';

  constructor(private readonly googleDriveService: GoogleDriveService) {}

  public async generatePdfByType(
    model: DailyLogEntity,
    key: 'dailyLog',
    fileName?: string
  );
  public async generatePdfByType(
    model: ProjectLogEntity,
    key: 'projectLog',
    fileName?: string
  );
  public async generatePdfByType(model: StudentEntity, key: 'studentDetails');
  public async generatePdfByType(model: ProjectEntity, key: 'projectDetails');
  public async generatePdfByType<T extends AbstractEntity>(
    model: T,
    key: PdfType,
    fileName: string = undefined
  ): Promise<Buffer | T> {
    try {
      const { templatePath, factory } = PdfService.PdfFactory[key];

      const template = handlebars.compile(
        await fs.promises.readFile(templatePath, 'utf8')
      );

      const content = template(factory(model));

      const buffer: Buffer = await html_to_pdf.generatePdf(
        { content },
        { preferCSSPageSize: true, printBackground: true }
      );

      if (fileName) {
        return await this.handlePdfUpload(buffer, fileName, model);
      }

      return buffer;
    } catch (error) {
      this.logger.error(error?.message || error);
      throw new InternalServerErrorException('Failed to create PDF.');
    }
  }

  private async handlePdfUpload<T extends AbstractEntity>(
    buffer: Buffer,
    fileName: string,
    model: T
  ): Promise<T> {
    try {
      await fs.promises.writeFile(
        `${this.localLogStoragePath}${fileName}.pdf`,
        buffer
      );

      const fileId: string = await this.googleDriveService.uploadFile(fileName);
      return Object.assign(model, { fileId });
    } catch (error) {
      this.logger.error(
        `Failed to upload pdf with error ${error?.message || error}`
      );
    }
  }
}
