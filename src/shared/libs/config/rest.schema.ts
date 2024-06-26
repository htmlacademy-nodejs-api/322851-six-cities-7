import convict from 'convict';
import validator from 'convict-format-with-validator';

convict.addFormats(validator);

export type RestSchema = {
  PORT: number,
  SALT: string,
  DB_HOST: string,
  DB_USER: string,
  DB_PASSWORD: string ,
  DB_PORT: string,
  DB_NAME: string,
  UPLOAD_DIRECTORY: string,
  JWT_SECRET: string,
  HOST: string,
  STATIC_PATH: string
}

export const configRestSchema = convict<RestSchema>({
  PORT: {
    doc: 'Port for incoming connections',
    format: 'port',
    env: 'PORT',
    default: 4000
  },
  SALT: {
    doc: 'String for crypting user password',
    format: String,
    env: 'SALT',
    default: null
  },
  DB_HOST: {
    doc: 'IP address of the database server',
    format: 'ipaddress',
    env: 'DB_HOST',
    default: null
  },
  DB_USER: {
    doc: 'User for the database server',
    format: String,
    env: 'DB_USER',
    default: null
  },
  DB_PASSWORD: {
    doc: 'Password for the database server',
    format: String,
    env: 'DB_PASSWORD',
    default: null
  },
  DB_PORT: {
    doc: 'PORT for the database server',
    format: 'port',
    env: 'DB_PORT',
    default: '27017'
  },
  DB_NAME: {
    doc: 'Name of the database',
    format: String,
    env: 'DB_NAME',
    default: 'Six-cities-db'
  },
  UPLOAD_DIRECTORY: {
    doc: 'Directory for users files',
    format: String,
    env: 'UPLOAD_DIRECTORY',
    default: null
  },
  JWT_SECRET: {
    doc: 'Secret for JSON token',
    format: String,
    env: 'JWT_SECRET',
    default: null
  },
  HOST: {
    doc: 'Host where started service',
    format: String,
    env: 'HOST',
    default: 'localhost'
  },
  STATIC_PATH: {
    doc: 'Path to keep static files',
    format: String,
    env: 'STATIC_PATH',
    default: 'static'
  }

});
