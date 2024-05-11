import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

export const getCurrentModeuleDicrectoryPath = () => {
  const filepath = fileURLToPath(import.meta.url);
  return dirname(filepath);
};
