import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ProjectLogCreatedEvent } from 'src/common';
import { ProjectLogEntity } from 'src/modules/project-log/entities';
import { ProjectLogService } from 'src/modules/project-log/services';
import { EntityManager, InsertEvent } from 'typeorm';

@Injectable()
export class ProjectLogSubscriber {
  constructor(
    @InjectEntityManager() private readonly manager: EntityManager,
    private readonly emitter: EventEmitter2,
    private readonly service: ProjectLogService
  ) {
    this.manager.connection.subscribers.push(this);
  }

  listenTo() {
    return ProjectLogEntity;
  }

  async beforeInsert(event: InsertEvent<ProjectLogEntity>): Promise<void> {
    const projectLog = event.entity as ProjectLogEntity;

    const { count } = await this.service.findProjectLogsByDate(
      projectLog.logDate
    );

    await this.emitter.emitAsync(ProjectLogCreatedEvent, { projectLog, count });
  }
}
