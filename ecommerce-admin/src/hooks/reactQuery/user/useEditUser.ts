import { editUser, IAddUserPayload } from '@/services/user';
import { useMutation } from '@tanstack/react-query';

type EditUserVariables = {
  userId: string;
  payload: IAddUserPayload;
};

export const useEditUser = () => {
  const { data, isPending, isSuccess, mutateAsync, isError, error } = useMutation({
    mutationKey: ['edit-user'],
    mutationFn: async ({ userId, payload }: EditUserVariables) => await editUser(userId, payload),
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
