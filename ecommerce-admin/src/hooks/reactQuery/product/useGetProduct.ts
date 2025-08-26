import { getProduct } from '@/services/product';
import { useQuery } from '@tanstack/react-query';

export const useGetProduct = (productId: string) => {
  const { data, isLoading, isFetching, isSuccess, isError, error, refetch } = useQuery({
    queryKey: ['ProductList', productId],
    queryFn: () => getProduct(productId),
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
