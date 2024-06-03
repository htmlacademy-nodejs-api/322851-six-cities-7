import { ClassConstructor, plainToInstance } from 'class-transformer';

const getRandomInteger = (a: number, b: number) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));
  const result = Math.random() * (upper - lower + 1) + lower;
  return Math.floor(result);
};

const generateRandomIndex = (a: number, b: number) => {
  const indexNumbers: number[] = [];
  return () => {
    let currentIndex = getRandomInteger(a, b);
    if (indexNumbers.length === Math.floor(Math.max(a, b) + 1)) {
      return false;
    }
    while (indexNumbers.includes(currentIndex)) {
      currentIndex = getRandomInteger(a, b);
    }
    indexNumbers.push(currentIndex);
    return currentIndex;
  };
};

const getRanndomElement = <T>(arr: T[]) => arr[getRandomInteger(0, arr.length - 1)];

const getRandomSubArray = <T>(arr: T[], count?: number) => {
  count = (!count) ? getRandomInteger(1, arr.length - 1) : count;
  const newArray: T[] = [];
  const indexGenerator = generateRandomIndex(0, arr.length - 1);
  for (let i = 0; i < count; i++) {
    const index = indexGenerator();
    if (index !== false) {
      newArray.push(arr[index]);
    }
  }
  return newArray;
};

const getErrorMessage = (error: unknown) => (error instanceof Error) ? error.message : '';

const createErrorObject = (message: string) => ({error: message});

const fillRdo = <T, V>(someDto: ClassConstructor<T>, plainObject: V) => plainToInstance(someDto, plainObject, {excludeExtraneousValues: true});

export {
  getRandomInteger,
  getRandomSubArray,
  getRanndomElement,
  getErrorMessage,
  createErrorObject,
  fillRdo
};
