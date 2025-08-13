import { debounce, get, isArray, isEmpty, isEqual } from 'lodash';
import { Dispatch, SetStateAction, useCallback, useEffect, useRef } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { createQueryString } from '@/utils/common';

type Options<T> = {
  params: T;
  setParams: Dispatch<SetStateAction<T>>;
  refetch: (options?: any) => Promise<any>;
  shouldNotBeAddedToQueryString?: (key: string, value: any, params: T) => boolean;
  shouldNotRefetchData?: (lastFetchingParams: T, currentParams: T) => boolean;
  shouldNotBindToBrowserUrl?: boolean;
};

export const useRefetchTableData = <T>({
  params,
  setParams,
  refetch,
  shouldNotBeAddedToQueryString = () => false,
  shouldNotRefetchData = () => false,
  shouldNotBindToBrowserUrl = false,
}: Options<T>) => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const refetchDebounce = useCallback(debounce(refetch, 500), [refetch]);
  const pathName = usePathname();
  const router = useRouter();

  const lastFetchingParamRef = useRef(params);

  const updateUrlQueryString = useCallback((currentParams: T) => {
    if (shouldNotBindToBrowserUrl) {
      return;
    }

    const finalQueryString = Object.entries(currentParams as any).reduce(
      (previousQueryString, current) => {
        const [key, value] = current;
        const isValueEmptyArray = isArray(value) && isEmpty(value);
        const isDefaultPage = key === 'pageIndex' && value === 1;
        const isDefaultPageSize = key === 'pageSize' && value === 10;

        if (
          !value ||
          isDefaultPage ||
          isDefaultPageSize ||
          isValueEmptyArray ||
          shouldNotBeAddedToQueryString?.(key, value, currentParams)
        ) {
          return previousQueryString;
        }

        const queryString = createQueryString(key, value as any, previousQueryString as any);

        return queryString;
      },
      '',
    );

    router.replace(`${pathName}?${finalQueryString}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRefetchData = useCallback((currentParams: T) => {
    if (!isEqual(lastFetchingParamRef.current, currentParams)) {
      if (shouldNotRefetchData(lastFetchingParamRef.current, currentParams)) {
        lastFetchingParamRef.current = currentParams;
        return;
      }

      const currentSearchKey = get(currentParams, 'searchKey');
      const lastSearchKey = get(lastFetchingParamRef.current, 'searchKey');

      if (currentSearchKey !== lastSearchKey) {
        lastFetchingParamRef.current = currentParams;
        return;
      }

      const previousPage = get(lastFetchingParamRef.current, 'pageIndex', 1);
      const currentPage = get(currentParams, 'pageIndex', 1);
      if (previousPage === currentPage && currentPage !== 1) {
        setParams(
          (current: T) =>
            ({
              ...current,
              page: 1,
            } as T),
        );
      }

      lastFetchingParamRef.current = currentParams;

      refetchDebounce();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    updateUrlQueryString(params);

    handleRefetchData(params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params]);
};
