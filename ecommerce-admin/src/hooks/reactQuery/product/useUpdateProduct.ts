import { editProduct, IEditProductPayload } from '@/services/product';
import { useMutation } from '@tanstack/react-query';

interface IPayload {
  productId: string;
  payload: IEditProductPayload;
}

export const useUpdateProduct = () => {
  const { data, isPending, isSuccess, mutateAsync, isError, error } = useMutation({
    mutationKey: ['update-product'],
    mutationFn: async (payload: IPayload) => await editProduct(payload.productId, payload.payload),
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
