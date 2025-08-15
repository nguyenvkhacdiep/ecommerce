import { resendEmailActiveUser } from '@/services/auth';
import { useMutation } from '@tanstack/react-query';

export const useResendEmailActiveUser = () => {
  const { data, isPending, isSuccess, mutateAsync, isError, error } = useMutation({
    mutationKey: ['use-resend-email-active-user'],
    mutationFn: async (email: string) => resendEmailActiveUser(email),
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
