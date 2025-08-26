import { editCategory, IEditCategoryPayload } from '@/services/category';
import { useMutation } from '@tanstack/react-query';

export interface IPayload {
  categoryId: string;
  payload: IEditCategoryPayload;
}

export const useEditCategory = () => {
  const { data, isPending, isSuccess, mutateAsync, isError, error } = useMutation({
    mutationKey: ['edit-category'],
    mutationFn: async (data: IPayload) => await editCategory(data.categoryId, data.payload),
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
