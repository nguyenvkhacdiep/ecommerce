import { PagingRequest } from '@/common/type';
import { getAllUsers } from '@/services/user';
import { useQuery } from '@tanstack/react-query';

export const useGetAllUsers = (options?: PagingRequest) => {
  const { data, isLoading, isFetching, isSuccess, isError, error, refetch } = useQuery({
    queryKey: ['UserList', options],
    queryFn: () => getAllUsers(options),
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
