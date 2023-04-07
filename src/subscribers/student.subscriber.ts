import { StudentEntity } from 'src/modules/student/entities';
import { generateHash } from 'src/util';
import { EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';

@EventSubscriber()
export class StudentSubscriber {
  listenTo() {
    return StudentEntity;
  }

  async beforeInsert(event: InsertEvent<StudentEntity>): Promise<void> {
    event.entity.password = await generateHash(event.entity.password);
  }

  async beforeUpdate(event: UpdateEvent<StudentEntity>): Promise<void> {
    if (event.entity?.password !== event.databaseEntity?.password) {
      event.entity.password = await generateHash(event.entity.password);
    }
  }
}
