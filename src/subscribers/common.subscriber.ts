import { EventSubscriber, UpdateEvent } from 'typeorm';

@EventSubscriber()
export class CommonSubscriber {
  beforeUpdate(event: UpdateEvent<any>): void {
    event.entity.updatedAt = new Date();
  }
}
