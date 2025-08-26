import { deleteProduct } from '@/services/product';
import { useMutation } from '@tanstack/react-query';

export const useDeleteProduct = () => {
  const { data, isPending, isSuccess, mutateAsync, isError, error } = useMutation({
    mutationKey: ['delete-product'],
    mutationFn: async (productId: string) => await deleteProduct(productId),
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
