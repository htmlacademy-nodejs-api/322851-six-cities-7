import { CreateUserDto } from './dto/create-user.dto.js';
import { RequestBody, RequestParams } from '../../../rest/index.js';
import { Request } from 'express';

export type CreateUserRequest = Request<RequestParams, RequestBody, CreateUserDto>;
