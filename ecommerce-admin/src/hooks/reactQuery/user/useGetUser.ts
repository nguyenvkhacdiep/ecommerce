import { getUserById } from '@/services/user';
import { useQuery } from '@tanstack/react-query';

export const useGetUser = (id: string) => {
  const { data, isLoading, isFetching, isSuccess, isError, error, refetch } = useQuery({
    queryKey: ['get-user', id],
    queryFn: () => getUserById(id),
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
