import { IResetPasswordPayload, setPassword } from '@/services/auth';
import { useMutation } from '@tanstack/react-query';

export const useSetPassword = () => {
  const { data, isPending, isSuccess, mutateAsync, isError, error } = useMutation({
    mutationKey: ['reset-password'],
    mutationFn: async (payload: IResetPasswordPayload) => await setPassword(payload),
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
