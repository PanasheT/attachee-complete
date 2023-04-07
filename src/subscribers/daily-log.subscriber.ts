import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectEntityManager } from '@nestjs/typeorm';
import { DailyLogCreatedEvent } from 'src/common';
import { DailyLogEntity } from 'src/modules/daily-log/entities';
import { EntityManager, InsertEvent } from 'typeorm';

@Injectable()
export class DailyLogSubscriber {
  constructor(
    @InjectEntityManager() private readonly manager: EntityManager,
    private readonly emitter: EventEmitter2
  ) {
    this.manager.connection.subscribers.push(this);
  }

  public listenTo() {
    return DailyLogEntity;
  }

  public async beforeInsert(event: InsertEvent<DailyLogEntity>): Promise<void> {
    const dailyLog = event.entity as DailyLogEntity;
    await this.emitter.emitAsync(DailyLogCreatedEvent, dailyLog);
  }
}
