import { IShopEditPayload, updateShop } from '@/services/shop';
import { useMutation } from '@tanstack/react-query';

type UpdateShopVariables = {
  shopId: string;
  payload: IShopEditPayload;
};

export const useUpdateShop = () => {
  const { data, isPending, isSuccess, mutateAsync, isError, error } = useMutation({
    mutationKey: ['update-shop'],
    mutationFn: async ({ shopId, payload }: UpdateShopVariables) =>
      await updateShop(shopId, payload),
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
