import { ILoginPayload, login as loginService } from '@/services/auth/auth';
import { useMutation } from '@tanstack/react-query';

export const useLogin = () => {
  const { data, isPending, isSuccess, mutateAsync, isError, error } = useMutation({
    mutationKey: ['login'],
    mutationFn: async (payload: ILoginPayload) => await loginService(payload),
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
