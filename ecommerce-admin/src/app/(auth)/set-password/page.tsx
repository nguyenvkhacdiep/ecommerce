'use client';

import { Form } from 'antd';
import React, { useEffect } from 'react';
import SetPasswordForm from './components/SetPasswordForm';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCheckToken } from '@/hooks/reactQuery/auth/useCheckToken';
import { useSetPassword } from '@/hooks/reactQuery/auth/useSetPassword';
import { showErrorMessage, showSuccessMessage } from '@/utils/alert';
import { TYPE_TOKEN } from '@/common/constant';

export interface ISetPasswordDataForm {
  password: string;
  confirmPassword: string;
}

const ResetPassword: React.FC = () => {
  const [form] = Form.useForm();
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get('token');
  const email = searchParams.get('email');

  const { data: isTokenValid, isError } = useCheckToken({
    token: token as string,
    type: TYPE_TOKEN.ActiveAccount,
  });

  const { mutateAsync, isPending } = useSetPassword();

  useEffect(() => {
    if ((isTokenValid && !isTokenValid) || isError) {
      router.push(`/token-expired?email=${email}`);
    }
  }, [isTokenValid, isError]);

  const handleSetPassword = async (data: ISetPasswordDataForm) => {
    try {
      const payload = {
        token: token as string,
        ...data,
      };
      const res = await mutateAsync(payload);
      showSuccessMessage('Set Password', res.message);
      router.push('/login');
    } catch (error: any) {
      if (!(error as any).data.errors) {
        showErrorMessage('Set Password', (error as any).data.message);
      }
    }
  };

  return (
    <div className="w-full h-screen flex justify-center items-center bg-[url(/background-login.jfif)] bg-no-repeat bg-cover">
      <div className="bg-white h-fit w-3/12 rounded-2xl flex flex-col items-center py-12">
        <div className="font-bold text-2xl">Set Password?</div>
        <div className="mt-8 w-full flex justify-center">
          <SetPasswordForm form={form} loading={isPending} onSubmit={handleSetPassword} />
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
