import { markOutOfStock } from '@/services/product';
import { useMutation } from '@tanstack/react-query';

export const useMarkOutOfStock = () => {
  const { data, isPending, isSuccess, mutateAsync, isError, error } = useMutation({
    mutationKey: ['mark-out-of-stock'],
    mutationFn: async (productId: string) => await markOutOfStock(productId),
  });

  return {
    data,
    isPending,
    isSuccess,
    mutateAsync,
    isError,
    error,
  };
};
