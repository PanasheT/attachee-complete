import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { validateUpdate } from 'src/util';
import { Repository } from 'typeorm';
import { CreateSupervisorDto, UpdateSupervisorDto } from '../dtos';
import { SupervisorEntity } from '../entities';
import { FindSupervisorQuery } from '../types';

@Injectable()
export class SupervisorFactory {
  constructor(
    @InjectRepository(SupervisorEntity)
    private readonly repo: Repository<SupervisorEntity>
  ) {}

  public async createSupervisor(
    model: CreateSupervisorDto
  ): Promise<SupervisorEntity> {
    await this.assertSupervisorExists({
      email: model.email,
      phone: model.phone,
    });

    return Object.assign(new SupervisorEntity(), model);
  }

  private async assertSupervisorExists(model: {
    email?: string;
    phone?: string;
  }): Promise<void> {
    const deleted = false;
    const query: FindSupervisorQuery[] = [
      model.email && { email: model.email, deleted },
      model.phone && { phone: model.phone, deleted },
    ].filter(Boolean);

    if (query.length > 0 && Boolean(await this.repo.findOneBy(query))) {
      throw new BadRequestException('Supervisor already exists.');
    }
  }

  public async updateSupervisor(
    model: UpdateSupervisorDto,
    supervisor: SupervisorEntity
  ): Promise<SupervisorEntity> {
    const validatedDto: Partial<SupervisorEntity> = validateUpdate(
      supervisor,
      model
    );

    await this.assertSupervisorExists({
      email: validatedDto?.email,
      phone: validatedDto?.phone,
    });

    return Object.assign(supervisor, { model });
  }
}
