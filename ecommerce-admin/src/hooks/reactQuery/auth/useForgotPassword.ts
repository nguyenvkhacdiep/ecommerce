import { forgotPassword, IForgotPasswordPayload } from '@/services/auth';
import { useMutation } from '@tanstack/react-query';

export const useForgotPassword = () => {
  const { data, isPending, isSuccess, mutateAsync, isError, error } = useMutation({
    mutationKey: ['forgot-password'],
    mutationFn: async (payload: IForgotPasswordPayload) => await forgotPassword(payload),
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
