import { Route } from '../index.js';
import { Response, Router } from 'express';

export interface Controller {
  readonly router: Router;
  addRoute(route: Route): void;
  send<T>(res: Response, statusCode: number, data: T): void;
  created<T>(res: Response, data: T): void;
  ok<T>(res: Response, data: T): void;
  noContent<T>(res: Response, data: T): void;
}
