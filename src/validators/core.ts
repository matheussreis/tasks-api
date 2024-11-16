export interface ValidatorResult {
  status: number;
  message?: string;
}

export interface CoreValidator {
  validate: (input: any, isUpdate?: boolean) => ValidatorResult;
}
