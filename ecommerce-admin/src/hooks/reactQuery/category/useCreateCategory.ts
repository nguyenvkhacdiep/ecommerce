import { addCategory, ICreateCategoryPayload } from '@/services/category';
import { useMutation } from '@tanstack/react-query';

export const useCreateCategory = () => {
  const { data, isPending, isSuccess, mutateAsync, isError, error } = useMutation({
    mutationKey: ['add-category'],
    mutationFn: async (payload: ICreateCategoryPayload) => await addCategory(payload),
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
