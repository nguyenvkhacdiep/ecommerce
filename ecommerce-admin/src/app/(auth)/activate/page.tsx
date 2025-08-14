'use client';

import React, { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { showErrorMessage } from '@/utils/alert';
import { useActiveUser } from '@/hooks/reactQuery/auth/useActiveUser';

export interface ISetPasswordDataForm {
  password: string;
  confirmPassword: string;
}

const Page: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get('token');

  const { data, error, isError } = useActiveUser(token as string);

  useEffect(() => {
    if (isError) {
      showErrorMessage(
        'Active account',
        (error as any)?.data?.message || (error as any)?.message || 'Unknown error',
      );
      router.push(`/login`);

      return;
    }

    if (data) {
      router.push(`/set-password?token=${data.setPasswordToken}`);
    }
  }, [data, isError]);

  return <></>;
};

export default Page;
