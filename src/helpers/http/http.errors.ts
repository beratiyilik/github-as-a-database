import { IResponse } from './types';
export class RejectError<T> extends Error {
  response: IResponse<T>;
  constructor(message: string, response: IResponse<T>) {
    super(message);
    this.name = 'RejectError';
    this.response = response;
  }
}
