import {
  ValidationArguments as BaseValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
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

  async validate(value: any, context: IsUniqueValidationContext): Promise<boolean> {
    const [entity, field] = context.constraints;

    /**
     * Try to find an entity with provided field and value to check if it already exists
     * select only id field since we don't want to use the other, lower payload etc
     */
    const record = await this.orm[entity].findFirst({
      where: {
        [field]: value,
      },
      select: {
        id: true,
      },
    });

    return !record;
  }

  defaultMessage(context: IsUniqueValidationContext): string {
    return `${context.property} must be unique`;
  }
}

export function IsUnique(entity: string, field: string, validationOptions?: ValidationOptions) {
  return function ({ constructor: target }: object, propertyName: string) {
    registerDecorator({
      target,
      propertyName,
      options: validationOptions,
      constraints: [entity, field],
      validator: IsUniqueConstraint,
    });
  };
}
