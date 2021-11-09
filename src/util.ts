import { CacheBag } from '@kuzmycz/react-cache';

export const flattenObject = (base: string, obj: any) => {
  if (obj === null || obj === undefined) return [];

  let result: any[] = [];

  const fieldName = (base: string, name: string) =>
    base.length > 0 ? `${base}.${name}` : name;

  Object.keys(obj).forEach(key => {
    let value = obj[key];

    if (typeof value === 'string' || Array.isArray(value)) {
      result.push({
        key: fieldName(base, key),
        value: value,
      });
    } else if (typeof value === 'object') {
      result = [...result, ...flattenObject(fieldName(base, key), value)];
    }
  });

  return result;
};

const index = (values: { name: string; value: any }[]) => {
  const result: any = {};
  values.forEach(item => {
    if (item.value !== undefined) result[item.name] = item.value;
  });

  return result;
};

export const trim = (value: any) => {
  if (value === undefined) return undefined;
  if (value === null) return undefined;
  if (!(typeof value === 'object')) return value;

  let hasValue = false;
  let result: any = {};
  Object.keys(value).forEach(key => {
    let keyResult = trim(value[key]);

    if (keyResult !== undefined) {
      hasValue = true;
      result[key] = keyResult;
    }
  });

  return hasValue ? result : undefined;
};

export const merge = (cache: CacheBag, original: any, newContent: any) => {
  const originalFlatten = flattenObject('', original);
  const newContentFlattened = flattenObject('', newContent);
  const indexedContent = index(newContentFlattened);

  // Remove cleared
  originalFlatten.forEach(item => {
    if (indexedContent[item.key] === undefined) cache.set(item.key, undefined);
  });

  // Add changes
  newContentFlattened.forEach(item => {
    cache.set(item.key, item.value);
  });
};

export const deepCopy = (obj: any): any => {
  if (!obj) return obj; // if falsy, return the falsy object

  if (Array.isArray(obj)) {
    return [...obj];
  } else if (typeof obj === 'object') {
    let copy: any = {};
    Object.keys(obj).forEach(key => (copy[key] = deepCopy(obj[key])));
    return copy;
  } else {
    return obj;
  }
};
