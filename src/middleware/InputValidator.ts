// validation.pipe.ts
import { PipeTransform, Injectable, ArgumentMetadata, BadRequestException, Logger } from '@nestjs/common';
import { ObjectSchema } from 'joi';
import * as Joi from 'joi';

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  private readonly logger = new Logger(JoiValidationPipe.name);

  constructor(private schema: ObjectSchema) {}

  transform(value: any, metadata: ArgumentMetadata) {
    const { error } = this.schema.validate(value, { abortEarly: true });
    if (error) {
      const errorMessage = error.details
        .map(detail => detail.message.replace(/['"]/g, ''))  // Remove quotes
        .join(', ');
      // this.logger.error(`Validation failed: ${errorMessage}`);
      throw new BadRequestException(errorMessage);
    }
    return value;
  }

  
}

export class JoiValidationPipeArray implements PipeTransform {
  constructor(private schema: Joi.Schema) {}

  transform(value: any) {
    const validationResult = Array.isArray(value)
      ? this.schema.validate(value) // Validate the array of objects
      : this.schema.validate([value]); // Wrap in an array for single object validation

    const { error } = validationResult;
    if (error) {
      throw new BadRequestException(error.details.map(err => err.message).join(', '));
    }
    return value; // Return the validated value
  }
}
