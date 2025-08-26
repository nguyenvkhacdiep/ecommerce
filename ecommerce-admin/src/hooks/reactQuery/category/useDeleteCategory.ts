import { deleteCategory } from '@/services/category';
import { useMutation } from '@tanstack/react-query';

export const useDeleteCategory = () => {
  const { data, isPending, isSuccess, mutateAsync, isError, error } = useMutation({
    mutationKey: ['delete-category'],
    mutationFn: async (categoryId: string) => await deleteCategory(categoryId),
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
