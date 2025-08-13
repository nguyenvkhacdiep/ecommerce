import { inactiveUser } from '@/services/user';
import { useMutation } from '@tanstack/react-query';

export const useInactiveUser = () => {
  const { data, isPending, isSuccess, mutateAsync, isError, error } = useMutation({
    mutationKey: ['inactive-user'],
    mutationFn: async (userId: string) => await inactiveUser(userId),
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
