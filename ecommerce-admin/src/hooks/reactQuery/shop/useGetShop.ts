import { getShop } from '@/services/shop';
import { useQuery } from '@tanstack/react-query';

export const useGetShop = (shopId: string) => {
  const { data, isLoading, isFetching, isSuccess, isError, error, refetch } = useQuery({
    queryKey: ['Shop', shopId],
    queryFn: () => getShop(shopId),
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
