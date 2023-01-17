import { isArray } from 'utils/utils';

/**
 * Paramters can be any fields on the Store Slice object. They can be a single value e.g. an id, or an array of ids, meaning we need to check this and place the id inside an arrya if it isn't already in one.
 *
 * @param value
 *
 * @param parameterName
 */
export function createArrayQueryParam<T, K extends keyof T>(
  valOrArrayOfVals: T[K] | readonly T[K][],
): readonly T[K][] {
  return isArray(valOrArrayOfVals) ? valOrArrayOfVals : [valOrArrayOfVals];
}

export function failedQuery(message: string) {
  return Promise.reject(new Error(message));
}
