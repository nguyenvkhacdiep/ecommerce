import { activeUser } from '@/services/auth';
import { useQuery } from '@tanstack/react-query';

export const useActiveUser = (token: string) => {
  const { data, isLoading, isFetching, isSuccess, isError, error, refetch } = useQuery({
    queryKey: ['use-active-user', token],
    queryFn: () => activeUser(token),
  });

  return {
    data,
    isLoading,
    isFetching,
    isSuccess,
    isError,
    error,
    refetch,
  };
};
