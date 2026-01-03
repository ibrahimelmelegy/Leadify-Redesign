import { plainToInstance } from 'class-transformer';
import { ValidationArguments, ValidationOptions, registerDecorator, validateSync } from 'class-validator';

/**
 * A custom decorator to validate a validation-schema within a validation schema upload N levels
 * @param schema - The validation schema to be used for nested validation
 * @param validationOptions - Optional validation options
 * @returns A decorator function that registers nested validation
 */
export function CustomValidateNested(schema: any, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'ValidateNested',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        /**
         * Validates the nested object or array of objects against the provided schema
         * @param value - The value to validate
         * @param args - Validation arguments
         * @returns boolean indicating if validation passed
         */
        validate(value: any, args: ValidationArguments) {
          args.value;
          if (Array.isArray(value)) {
            // Validate each item in the array
            for (let i = 0; i < (<Array<any>>value).length; i++) {
              if (validateSync(plainToInstance(schema, value[i])).length) {
                return false;
              }
            }
            return true;
          } else return validateSync(plainToInstance(schema, value)).length ? false : true;
        },
        /**
         * Generates error messages for validation failures
         * @param args - Validation arguments containing the value and property
         * @returns Formatted error message string
         */
        defaultMessage(args): string | any {
          if (Array.isArray(args!.value)) {
            // Generate error messages for array items
            for (let i = 0; i < (<Array<any>>args!.value).length; i++) {
              return (
                `${args!.property}::index${i} -> ` +
                validateSync(plainToInstance(schema, args!.value[i]))
                  .map(e => e.constraints)
                  .reduce((acc, next) => acc.concat(Object.values(next!) as []), [])
              ).toString();
            }
          } else {
            // Generate error message for single object
            const validationErrorMapping = validateSync(plainToInstance(schema, args!.value))
              .map(e => e.constraints)
              .reduce((acc, next) => acc.concat(Object.values(next!) as []), [])
              .toString();

            return validationErrorMapping.split(',')[0];
          }
        }
      }
    });
  };
}
