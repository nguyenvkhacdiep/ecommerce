import { addUser, IAddUserPayload } from '@/services/user';
import { useMutation } from '@tanstack/react-query';

export const useAddUser = () => {
  const { data, isPending, isSuccess, mutateAsync, isError, error } = useMutation({
    mutationKey: ['add-user'],
    mutationFn: async (payload: IAddUserPayload) => await addUser(payload),
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
