import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateSupervisorDto } from '../dtos';
import { SupervisorEntity } from '../entities';

@Injectable()
export class SupervisorFactory {
  constructor(
    @InjectRepository(SupervisorEntity)
    private readonly repo: Repository<SupervisorEntity>
  ) {}

  public async createSupervisor(
    model: CreateSupervisorDto
  ): Promise<SupervisorEntity> {
    await this.assertSupervisorExists(model.email, model.phone);

    return Object.assign(new SupervisorEntity(), { model });
  }

  private async assertSupervisorExists(
    email: string,
    phone: string
  ): Promise<void> {
    const deleted: boolean = false;
    const query = [
      { email, deleted },
      { phone, deleted },
    ];

    if (Boolean(await this.repo.findOneBy(query))) {
      throw new BadRequestException('Supervisor already exists.');
    }
  }
}
