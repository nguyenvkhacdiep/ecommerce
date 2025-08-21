import { deleteUser } from '@/services/user';
import { useMutation } from '@tanstack/react-query';

export const useDeleteUser = () => {
  const { data, isPending, isSuccess, mutateAsync, isError, error } = useMutation({
    mutationKey: ['delete-user'],
    mutationFn: async (userId: string) => await deleteUser(userId),
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
