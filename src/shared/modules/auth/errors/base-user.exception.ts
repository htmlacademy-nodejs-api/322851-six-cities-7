import { HttpError } from '../../../../rest/index.js';

export class BaseUserException extends HttpError {
  constructor(HttpSatusCode: number, message: string) {
    super(HttpSatusCode, message);
  }
}
