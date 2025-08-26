import { addProduct, ICreateProductPayload } from '@/services/product';
import { useMutation } from '@tanstack/react-query';

export const useCreateProduct = () => {
  const { data, isPending, isSuccess, mutateAsync, isError, error } = useMutation({
    mutationKey: ['add-product'],
    mutationFn: async (payload: ICreateProductPayload) => await addProduct(payload),
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
