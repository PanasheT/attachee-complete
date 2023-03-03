import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import * as moment from 'moment';
import { ProjectLogCreatedEvent } from 'src/common';
import { PdfService } from './pdf/services';
import { ProjectLogEntity } from './project-log/entities';

@Injectable()
export class MyListenerService {
  constructor(private readonly pdfService: PdfService) {}

  @OnEvent(ProjectLogCreatedEvent, { async: true })
  public async uploadProjectLogToGoogleDrive(model: ProjectLogEntity) {
    const fileName: string = `Project_Log_${moment(model.logDate).format(
      'DD_MM_YYYY'
    )}`;

    await this.pdfService.generatePdfByType(model, 'projectLog', fileName);
  }
}
