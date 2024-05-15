const getMongoURI = (
  username: string,
  password: string,
  host: string,
  port: string,
  dbName: string) => `mongodb://${username}:${password}@${host}:${port}/${dbName}?authSource=admin`;

export {
  getMongoURI
};

