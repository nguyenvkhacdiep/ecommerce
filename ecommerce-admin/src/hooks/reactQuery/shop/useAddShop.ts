import { addShop, IShopCreatePayload } from '@/services/shop';
import { useMutation } from '@tanstack/react-query';

export const useAddShop = () => {
  const { data, isPending, isSuccess, mutateAsync, isError, error } = useMutation({
    mutationKey: ['add-shop'],
    mutationFn: async (payload: IShopCreatePayload) => await addShop(payload),
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
