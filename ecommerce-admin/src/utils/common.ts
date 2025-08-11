import { Options } from '@/common/type';
import { isEqual } from 'lodash';
import { ReadonlyURLSearchParams } from 'next/navigation';
import { useMemo } from 'react';

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

export const formatNumberWithUnit = (value: number, singular: string, plural: string) => {
  if (value === 1) return `${value} ${singular}`;
  return `${value} ${plural}`;
};

export const createQueryString = (
  name: string,
  value: string,
  searchParams: ReadonlyURLSearchParams,
) => {
  const params = new URLSearchParams(searchParams.toString());
  params.set(name, value);

  return params.toString();
};

export const queryParamsBuilder = (params: any) => {
  if (!params) return '';

  const cloneParams = {
    ...params,
    searchBy: !!params?.searchBy && !!params?.q ? params?.searchBy : undefined,
  };

  const queryParams = new URLSearchParams();

  Object.entries(cloneParams).forEach(([key, value]) => {
    if (value) {
      if (Array.isArray(value)) {
        value.forEach((value) => queryParams.append(key, value));
      } else {
        queryParams.append(key, value as any);
      }
    }
  });

  return queryParams.toString();
};

export const useTransformOptions = <T>(
  data: T[] | undefined,
  valueKey: string,
  labelKey: string,
): Options => {
  return useMemo(() => {
    if (!data) return [];

    return data.map((item: any) => ({
      value: item[valueKey],
      label: item[labelKey],
    }));
  }, [data, labelKey, valueKey]);
};
