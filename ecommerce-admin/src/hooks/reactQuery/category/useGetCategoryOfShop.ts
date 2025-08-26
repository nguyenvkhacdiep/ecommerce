import { PagingRequest } from '@/common/type';
import { getAllCategoriesOfShop } from '@/services/category';
import { useQuery } from '@tanstack/react-query';

export const useGetAllCategoriesOfShop = (shopId: string, options?: PagingRequest) => {
  const { data, isLoading, isFetching, isSuccess, isError, error, refetch } = useQuery({
    queryKey: ['category-list-shop', shopId, options],
    queryFn: () => getAllCategoriesOfShop(shopId, options),
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
