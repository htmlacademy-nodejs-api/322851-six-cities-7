import { isArray } from 'class-validator';
import { DEFAULT_STATIC_IMAGES, STATIC_RESOURCE_FIELDS, STATIC_ROUTE, UPLOAD_ROUTE } from '../const.js';


function isObject(value: unknown): value is Record<string, object> {
  return typeof value === 'object' && value !== null;
}

function hasDefaultImage(image: string) {
  return DEFAULT_STATIC_IMAGES.includes(image);
}

function isStaticProperty(property: string) {
  return STATIC_RESOURCE_FIELDS.includes(property);
}

function transformPath(data: Record<string, unknown>, serverPath: string): Record<string, unknown> {
  const stack = [data];
  while (stack.length > 0) {
    const current = stack.pop();

    for (const key in current) {
      if (Object.hasOwn(current, key)) {
        const value = current[key];

        if (key === 'images' && isArray(value)) {
          current[key] = value.map((image) => {
            const rootPath = hasDefaultImage(image) ? STATIC_ROUTE : UPLOAD_ROUTE;
            return `${serverPath}${rootPath}/${image}`;
          });
          continue;
        }

        if (isObject(value)) {
          stack.push(value);
          continue;
        }

        if (isStaticProperty(key) && typeof value === 'string') {
          const rootPath = hasDefaultImage(value) ? STATIC_ROUTE : UPLOAD_ROUTE;

          current[key] = `${serverPath}${rootPath}/${value}`;
        }
      }
    }
  }
  return data;
}

export { transformPath };
