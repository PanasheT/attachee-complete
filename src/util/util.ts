import { BadRequestException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

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

export function areDatesTheSame(D1: Date, D2: Date): boolean {
  return (
    D1.getFullYear() === D2.getFullYear() &&
    D1.getMonth() === D2.getMonth() &&
    D1.getDate() === D2.getDate()
  );
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

export async function generateHash(password: string): Promise<string> {
  const saltRounds: string = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, saltRounds);
}

export async function isPasswordCorrect(
  attempt: string,
  hash: string
): Promise<boolean> {
  return await bcrypt.compare(attempt, hash);
}
