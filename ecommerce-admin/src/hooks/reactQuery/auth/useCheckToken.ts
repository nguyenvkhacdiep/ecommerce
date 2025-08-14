import { checkToken, ICheckToken } from '@/services/auth';
import { useQuery } from '@tanstack/react-query';

export const useCheckToken = (params: ICheckToken) => {
  const { data, isLoading, isSuccess, isError, error, refetch } = useQuery({
    queryKey: ['check-reset-password-token', params],
    queryFn: () => checkToken(params),
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
