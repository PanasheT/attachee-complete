import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { InjectEntityManager } from '@nestjs/typeorm';
import { StudentCreatedEvent } from 'src/common';
import { StudentEntity } from 'src/modules/student/entities';
import { generateHash } from 'src/util';
import {
  EntityManager,
  EventSubscriber,
  InsertEvent,
  UpdateEvent,
} from 'typeorm';

@Injectable()
@EventSubscriber()
export class StudentSubscriber {
  constructor(
    @InjectEntityManager()
    manager: EntityManager,
    private readonly emitter: EventEmitter2
  ) {
    manager.connection.subscribers.push(this);
  }

  listenTo() {
    return StudentEntity;
  }

  async beforeInsert(event: InsertEvent<StudentEntity>): Promise<void> {
    event.entity.password = await generateHash(event.entity.password);
    const student = event.entity as StudentEntity;

    await this.emitter.emitAsync(StudentCreatedEvent, student);
  }

  async beforeUpdate(event: UpdateEvent<StudentEntity>): Promise<void> {
    if (event.entity?.password) {
      event.entity.password = await generateHash(event.entity.password);
    }
  }
}
