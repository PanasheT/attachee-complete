import { Injectable } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import * as moment from 'moment';
import { DailyLogCreatedEvent, ProjectLogCreatedEvent } from 'src/common';
import { DailyLogEntity } from './daily-log/entities';
import { DailyLogService } from './daily-log/services';
import { PdfService } from './pdf/services';
import { ProjectLogEntity } from './project-log/entities';
import { ProjectLogService } from './project-log/services';

@Injectable()
export class MyListenerService {
  constructor(
    private readonly pdfService: PdfService,
    private readonly projectLogService: ProjectLogService,
    private readonly dailyLogService: DailyLogService
  ) {}

  @OnEvent(ProjectLogCreatedEvent, { async: true })
  public async uploadProjectLogToGoogleDrive(model: {
    projectLog: ProjectLogEntity;
    count: number;
  }) {
    const fileName = `Project_Log_${moment(model.projectLog.logDate).format(
      'DD_MM_YYYY'
    )}_${model.count + 1}`;

    const projectLogWithFileId: ProjectLogEntity =
      await this.pdfService.generatePdfByType(
        model.projectLog,
        'projectLog',
        fileName
      );

    await this.projectLogService.addFileIdToProjectLog(projectLogWithFileId);
  }

  @OnEvent(DailyLogCreatedEvent, { async: true })
  public async uploadDailyLogToGoogleDrive(model: DailyLogEntity) {
    const fileName = `Daily_Log_${moment(model.checkIn).format('DD_MM_YYYY')}`;
    const dailyLogWithFileId: DailyLogEntity =
      await this.pdfService.generatePdfByType(model, 'dailyLog', fileName);
    await this.dailyLogService.addFileIdToDailyLog(dailyLogWithFileId);
  }
}
