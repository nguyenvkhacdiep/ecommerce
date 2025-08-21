import { deleteShop } from '@/services/shop';
import { useMutation } from '@tanstack/react-query';

export const useDeleteShop = () => {
  const { data, isPending, isSuccess, mutateAsync, isError, error } = useMutation({
    mutationKey: ['delete-shop'],
    mutationFn: async (shopId: string) => await deleteShop(shopId),
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
