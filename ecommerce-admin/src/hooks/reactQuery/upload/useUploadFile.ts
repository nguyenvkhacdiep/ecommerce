import { uploadFile } from '@/services/upload';
import { useMutation } from '@tanstack/react-query';

export const useUploadFile = () => {
  const { data, isPending, isSuccess, mutateAsync, isError, error } = useMutation({
    mutationKey: ['upload-file'],
    mutationFn: (option: FormData) => uploadFile(option),
  });

  return {
    data,
    isSuccess,
    isError,
    error,
    isPending,
    mutateAsync,
  };
};
