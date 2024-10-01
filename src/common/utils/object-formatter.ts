import { plainToClass } from 'class-transformer';

export function assignAndTransform<T>(Model: new () => T, data: Partial<T>): T {
  const instance = plainToClass(Model, data);
  Object.assign(instance, data);
  return instance;
}
