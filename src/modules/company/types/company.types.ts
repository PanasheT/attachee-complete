import { FindQuery } from 'src/common';
import { CompanyEntity } from '../entities';

export type CompanyIdentificationProperties = 'uuid' | 'name';

export type FindCompanyQuery = FindQuery<
  CompanyEntity,
  CompanyIdentificationProperties
>;
