import { isEqual } from 'lodash';

const isEquals = (left: any, right: any): number => {
  return isEqual(left, right) ? 1 : 0;
};

export const isChanged = (currentVal: any, initVal: any): boolean => {
  try {
    if (currentVal && !initVal) {
      return true;
    }
    const fields: string[] = Object.keys(currentVal);
    let ret = 0;
    fields.forEach((field) => (ret ^= isEquals(currentVal[field], initVal[field])));
    return Boolean(ret);
  } catch {
    return false;
  }
};
