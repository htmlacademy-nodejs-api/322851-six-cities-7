import * as crypto from 'node:crypto';

const createSHA256 = (password: string, salt: string): string => crypto.createHmac('sha256', salt).update(password).digest('hex');


export {
  createSHA256
};
