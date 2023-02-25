import { FindOperator } from 'typeorm';
import { AbstractEntity } from './abstract.entity';

export type AbstractPropertiesCollection<T extends keyof AbstractEntity> = T;

export type AbstractProperties = AbstractPropertiesCollection<
  'uuid' | 'createdAt' | 'updatedAt' | 'deleted'
>;

export type FindQuery<T, K extends keyof T> = Partial<
  Pick<
    {
      -readonly [P in keyof T]: T[P] | FindOperator<any>;
    },
    K
  > & { deleted: boolean }
>;
