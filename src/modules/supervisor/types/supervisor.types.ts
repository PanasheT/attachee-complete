import { FindQuery } from 'src/common';
import { SupervisorEntity } from '../entities';

export type SupervisorIdentificationProperties = 'uuid' | 'email' | 'phone';

export type FindSupervisorQuery = FindQuery<
  SupervisorEntity,
  SupervisorIdentificationProperties
>;
