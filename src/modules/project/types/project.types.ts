import { FindQuery } from 'src/common';
import { ProjectEntity } from '../entities';

export type ProjectIdentificationProperties = 'uuid' | 'name';

export type FindProjectQuery = FindQuery<
  ProjectEntity,
  ProjectIdentificationProperties
>;
