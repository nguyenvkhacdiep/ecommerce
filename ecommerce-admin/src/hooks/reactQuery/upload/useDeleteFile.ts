import { deleteFile } from '@/services/upload';
import { useMutation } from '@tanstack/react-query';

export const useDeleteFile = () => {
  const { data, isPending, isSuccess, mutateAsync, isError, error } = useMutation({
    mutationKey: ['upload-file'],
    mutationFn: (filename: string) => deleteFile(filename),
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
