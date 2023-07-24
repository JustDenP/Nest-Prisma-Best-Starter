import { Type } from '@nestjs/common';
import {
  registerDecorator,
  ValidationArguments as BaseValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { PrismaService } from 'database/prisma.service';

export interface ValidationArguments<
  Constraints extends unknown[] = [],
  Object_ extends object = object,
> extends BaseValidationArguments {
  object: Object_;
  constraints: Constraints;
}

export type IsUniqueValidationContext = ValidationArguments<Parameters<typeof IsUnique>>;

@ValidatorConstraint({ async: true })
export class IsUniqueConstraint implements ValidatorConstraintInterface {
  constructor(private readonly orm: PrismaService) {}

  async validate<Entity, Field extends keyof Entity>(
    value: Entity[Field],
    context: IsUniqueValidationContext,
  ): Promise<boolean> {
    const [entityType, field] = context.constraints;

    const query = await this.orm
      .$queryRaw`SELECT COUNT(*) as count FROM "${entityType()}" WHERE ${field} = ${value};`;

    const rawCount = query[0]?.count;
    return rawCount == '0n' || '0' || 0 ? true : false;
  }

  defaultMessage(context: IsUniqueValidationContext): string {
    return `${context.property} must be unique`;
  }
}

export const IsUnique =
  <Entity>(entityType: () => Type<Entity>, field: keyof Entity, options?: ValidationOptions) =>
  ({ constructor: target }: object, propertyName: string) =>
    registerDecorator({
      constraints: [entityType, field],
      target,
      options,
      propertyName,
      validator: IsUniqueConstraint,
    });
