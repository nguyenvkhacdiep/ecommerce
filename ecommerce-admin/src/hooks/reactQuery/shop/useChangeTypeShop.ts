import { changeTypeShop, IShopChangeTypePayload } from '@/services/shop';
import { useMutation } from '@tanstack/react-query';

type ChangeTypeShopVariables = {
  shopId: string;
  payload: IShopChangeTypePayload;
};

export const useChangeTypeShop = () => {
  const { data, isPending, isSuccess, mutateAsync, isError, error } = useMutation({
    mutationKey: ['change-type-shop'],
    mutationFn: async ({ shopId, payload }: ChangeTypeShopVariables) =>
      await changeTypeShop(shopId, payload),
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
