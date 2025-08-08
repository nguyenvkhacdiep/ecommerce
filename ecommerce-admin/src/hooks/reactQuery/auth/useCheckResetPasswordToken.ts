import { checkResetPasswordToken } from '@/services/auth/auth';
import { useQuery } from '@tanstack/react-query';

export const useCheckResetPasswordToken = (token: string) => {
  const { data, isLoading, isSuccess, isError, error, refetch } = useQuery({
    queryKey: ['check-reset-password-token', token],
    queryFn: () => checkResetPasswordToken(token),
  });

  return {
    data,
    isLoading,
    isSuccess,
    isError,
    error,
    refetch,
  };
};
