import { ObjectId } from 'mongodb';
import { CoreService } from '../services';

export default class CommonValidator {
  static isValidDate(date: Date) {
    return !isNaN(date.getTime());
  }

  static checkCollectionFields<Model>(fields: Array<string>, model: Model) {
    const invalidFields = Object.keys(model).filter(
      (key) => !fields.includes(key)
    );

    if (invalidFields.length > 0) {
      return {
        status: 400,
        message: `Invalid fields provided: ${invalidFields.join(', ')}`,
      };
    }

    return null;
  }

  static async checkExistingRecordOnUpdate<Model>(
    service: CoreService<Model>,
    id: ObjectId
  ) {
    const exists = await service.exists(id);

    if (exists === false) {
      return {
        status: 404,
        message: 'Record not found.',
      };
    }

    return {
      status: 200,
    };
  }

  static validateRequiredField(field: string | undefined, fieldName: string) {
    if (!field || field.trim().length === 0) {
      return {
        status: 400,
        message: `${fieldName} is required.`,
      };
    }

    return null;
  }

  static validateDateField(date: string | Date | undefined, fieldName: string) {
    const parsedDate = new Date(date);
    if (!CommonValidator.isValidDate(parsedDate)) {
      return {
        status: 400,
        message: `Invalid ${fieldName} for project.`,
      };
    }

    return null;
  }
}
