import { PagingRequest } from '@/common/type';
import { getAllProductsOfShop } from '@/services/product';
import { useQuery } from '@tanstack/react-query';

export const useGetAllProductsOfShop = (shopId: string, options?: PagingRequest) => {
  const { data, isLoading, isFetching, isSuccess, isError, error, refetch } = useQuery({
    queryKey: ['product-list=shop', shopId, options],
    queryFn: () => getAllProductsOfShop(shopId, options),
    enabled: !!shopId,
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
