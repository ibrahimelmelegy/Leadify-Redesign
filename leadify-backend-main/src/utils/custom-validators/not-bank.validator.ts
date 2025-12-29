/**
 * Custom validator decorator that checks if a string value is not blank.
 * A value is considered blank if it is not a string or if it contains only whitespace characters.
 * @param validationOptions Optional validation options from class-validator
 * @returns Decorator function that validates if a string is not blank
 */
import { ValidateBy, ValidationOptions } from 'class-validator';

export function IsNotBlank(validationOptions?: ValidationOptions) {
  return ValidateBy(
    {
      name: 'isNotBlank',
      constraints: [],
      validator: {
        validate(value: any) {
          return typeof value === 'string' && value.trim().length > 0;
        },
        defaultMessage: (options) => `${options!.property} must not be blank`,
      },
    },
    validationOptions,
  );
}
