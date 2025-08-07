import { ILoginPayload, login as loginService } from '@/services/user/user';
import { useMutation } from '@tanstack/react-query';

export const useLogin = () => {
  const { data, isPending, isSuccess, mutateAsync, isError, error } = useMutation({
    mutationKey: ['createAccount'],
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
