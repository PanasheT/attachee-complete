import { BadRequestException } from '@nestjs/common';

export function validateUpdate<T>(model: T, update: Partial<T>): Partial<T> {
  const validated: Partial<T> = Object.keys(update).reduce((validated, key) => {
    if (update[key] && model[key] !== update[key]) {
      validated[key] = update[key];
    }
    return validated;
  }, {});

  if (Object.entries(validated).length === 0) {
    throw new BadRequestException('No changes were made.');
  }

  return validated;
}

export function getStartAndEndOfDate(arg: Date): {
  startOfLogDate: Date;
  endOfLogDate: Date;
} {
  return {
    startOfLogDate: new Date(arg.getFullYear(), arg.getMonth(), arg.getDate()),
    endOfLogDate: new Date(
      arg.getFullYear(),
      arg.getMonth(),
      arg.getDate(),
      23,
      59,
      59,
      999
    ),
  };
}
