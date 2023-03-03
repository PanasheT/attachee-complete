import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectEntityManager } from '@nestjs/typeorm';
import { ProjectLogCreatedEvent } from 'src/common';
import { ProjectLogEntity } from 'src/modules/project-log/entities';
import { EntityManager, InsertEvent } from 'typeorm';

@Injectable()
export class ProjectLogSubscriber {
  constructor(
    @InjectEntityManager() private readonly manager: EntityManager,
    private readonly emitter: EventEmitter2
  ) {
    this.manager.connection.subscribers.push(this);
  }

  listenTo() {
    return ProjectLogEntity;
  }

  async beforeInsert(event: InsertEvent<ProjectLogEntity>): Promise<void> {
    const projectLog = event.entity as ProjectLogEntity;
    await this.emitter.emitAsync(ProjectLogCreatedEvent, projectLog);
  }
}
