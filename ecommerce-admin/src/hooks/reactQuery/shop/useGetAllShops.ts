import { PagingRequest } from '@/common/type';
import { getAllShops } from '@/services/shop';
import { useQuery } from '@tanstack/react-query';

export const useGetAllShops = (options?: PagingRequest) => {
  const { data, isLoading, isFetching, isSuccess, isError, error, refetch } = useQuery({
    queryKey: ['ShopList', options],
    queryFn: () => getAllShops(options),
  });

  return {
    data,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
    refetch,
  };
};
