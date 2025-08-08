import { IResetPasswordPayload, resetPassword } from '@/services/auth/auth';
import { useMutation } from '@tanstack/react-query';

export const useResetPassword = () => {
  const { data, isPending, isSuccess, mutateAsync, isError, error } = useMutation({
    mutationKey: ['reset-password'],
    mutationFn: async (payload: IResetPasswordPayload) => await resetPassword(payload),
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
