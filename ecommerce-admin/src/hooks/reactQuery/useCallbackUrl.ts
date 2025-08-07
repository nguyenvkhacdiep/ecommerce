import { useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

export const useCallbackUrl = () => {
  const searchParams = useSearchParams();

  const redirectToCallback = useCallback(() => {
    const callbackUrl = searchParams.get('callbackUrl');
    const destinationUrl = callbackUrl || '/dashboard';

    window.location.href = destinationUrl;
  }, [searchParams]);

  return { redirectToCallback };
};
