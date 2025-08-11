import { getAllRoles } from '@/services/auth';
import { useQuery } from '@tanstack/react-query';

export const useGetAllRoles = () => {
  const { data, isLoading, isFetching, isSuccess, isError, error, refetch } = useQuery({
    queryKey: ['get-all-roles'],
    queryFn: () => getAllRoles(),
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
