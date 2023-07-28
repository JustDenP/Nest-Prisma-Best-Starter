import { USERNAME_REGEX } from '@common/@types/constants/regex';
import type {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraintInterface,
} from 'class-validator';
import { registerDecorator, ValidatorConstraint } from 'class-validator';

@ValidatorConstraint({ async: true })
class IsUsernameConstraint implements ValidatorConstraintInterface {
  async validate(value: string, _argument: ValidationArguments) {
    return USERNAME_REGEX.test(value);
  }

  defaultMessage(argument: ValidationArguments) {
    const property = argument.property;

    return `${property} must fulfill username's criteria.`;
  }
}

export const IsUsername = (validationOptions?: ValidationOptions) =>
  function (object: Record<string, any>, propertyName: string): void {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUsernameConstraint,
    });
  };
