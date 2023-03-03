import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import * as moment from 'moment';
import { DailyLogCreatedEvent, ProjectLogCreatedEvent } from 'src/common';
import { DailyLogEntity } from './daily-log/entities';
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

  @OnEvent(DailyLogCreatedEvent, { async: true })
  public async uploadDailyLogToGoogleDrive(model: DailyLogEntity) {
    const fileName: string = `Daily_Log_${moment(model.checkIn).format(
      'DD_MM_YYYY'
    )}`;

    await this.pdfService.generatePdfByType(model, 'dailyLog', fileName);
  }
}
